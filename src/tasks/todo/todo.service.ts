import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDtoStatus } from './dto/update-todo.dto';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../task/entities/task.entity';
import { Auth } from 'src/auth/auth/entities/register';
import * as ExcelJS from 'exceljs';
import { Workbook } from 'exceljs';


@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
   
  ){}
  /**
   * 
   * @param createTodoDto 
   * @description create todo
   * @method Post
   * @param taskId 
   * @returns 
   */
 async create(createTodoDto: CreateTodoDto , taskId: number) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['todochecklist'], // Include the todochecklist relationship
    });
  
    if (!task) {
      throw new NotFoundException('Task not found');
    }
  
    // Create a new Todo item
    const newTodo = this.todoRepository.create({
      ...createTodoDto,
      task, // Associate the Todo with the task
    });
  
    // Save the new Todo
    const savedTodo = await this.todoRepository.save(newTodo);
  
    // Add the new Todo to the task's todochecklist array
    task.todochecklist.push(savedTodo);
  
    // Save the updated task
   const savedTask = await this.taskRepository.save(task);
  
    return {
      status: 200,
      data: savedTask
    };
  }

  
/**
 * 
 * @description update todo
 * @method Put
 * @param taskId 
 * @param todoId 
 * @param status 
 * @param userId 
 * @returns 
 */
  async updateTodoStatus(
    taskId: number,
    todoId: number,
    status: boolean,
    userId: number,
  ): Promise<Task> {
    // Fetch the task with its relationships
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['createdBy', 'assignedTo', 'todochecklist'],
      select: {
        createdBy: { id: true, name: true, email: true },
        assignedTo: { id: true, name: true, email: true },
      } // Include all necessary relationships
    });
  
    if (!task) {
      throw new NotFoundException('Task not found');
    }
  
    // Authorization check: Ensure the user is the creator or an assignee
    const isCreator = task.createdBy.id === userId;
    const isAssigned = task.assignedTo.some((user) => user.id === userId);
  
    if (!isCreator && !isAssigned) {
      throw new ForbiddenException('You are not authorized to update this task');
    }
  
    // Find the specific Todo item
    const todo = task.todochecklist.find((item) => item.id === todoId);
    if (!todo) {
      throw new NotFoundException('Todo item not found');
    }
  console.log(status);
    // Update the status of the Todo item
    todo.completed = status;
  
    // Save the updated Todo item
    await this.todoRepository.save(todo);
  
    // Check if all Todo items are completed
    const allTodosCompleted = task.todochecklist.every((item) => item.completed);
  
    // Update the task status based on the completion of all Todo items
    if (allTodosCompleted) {
      task.status = 'completed';
    } else {
      task.status = task.todochecklist.some((item) => item.completed) ? 'inprogress' : 'pending';
    }
  
    // Save the updated task
    return this.taskRepository.save(task);
  }

 
  /**
   * 
   * @method Get
   * @description export tasks to excel
   */
   async exportTasksToExcel() {
    try {
      // Step 1: Fetch tasks with relations
      const tasks = await this.taskRepository.find({
        relations: ['createdBy', 'assignedTo', 'todochecklist'],
        select: {
          createdBy: { id: true, name: true, email: true },
          assignedTo: { id: true, name: true, email: true },
        }
      });
      console.log('Loaded tasks:', tasks);

      // Step 2: Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Tasks Report');

      // Step 3: Define the columns for the worksheet
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Description', key: 'description', width: 30 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Priority', key: 'priority', width: 15 },
        { header: 'Due Date', key: 'dueDate', width: 20 },
        { header: 'Progress (%)', key: 'progress', width: 15 },
        { header: 'Created By', key: 'createdByName', width: 25 },
        { header: 'Assigned To', key: 'assignedToNames', width: 30 },
        { header: 'Checklist Completed', key: 'checklistStatus', width: 25 },
      ];

      // Step 4: Add rows to the worksheet
      tasks.forEach((task) => {
        // Calculate checklist progress
        const totalTodos = task.todochecklist?.length || 0;
        const completedTodos = task.todochecklist?.filter((todo) => todo.completed).length || 0;
        const progress =
          totalTodos > 0 ? parseFloat(((completedTodos / totalTodos) * 100).toFixed(2)) : 0;

        // Format due date
        const formattedDueDate = task.dueDate
          ? task.dueDate.toISOString().split('T')[0] // Extract YYYY-MM-DD
          : 'N/A';

        // Add row to the worksheet
        worksheet.addRow({
          id: task.id,
          description: task.description || 'N/A',
          status: task.status || 'N/A',
          priority: task.priority || 'N/A',
          dueDate: formattedDueDate,
          progress: progress,
          createdByName: task.createdBy?.name || 'N/A',
          assignedToNames: task.assignedTo?.map((user) => user.name).join(', ') || 'None',
          checklistStatus: `${completedTodos}/${totalTodos} done`,
        });
      });

      // Log the number of rows added
      console.log('Row count after adding data:', worksheet.rowCount);

      // Step 5: Return the workbook as a buffer
      return workbook.xlsx.writeBuffer();
    } catch (error) {
      console.error('Error generating Excel report:', error);
      throw new InternalServerErrorException(
        'Failed to generate report',
        error.message,
      );
    }
  
}}
