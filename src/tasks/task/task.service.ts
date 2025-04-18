import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import {  In, LessThan, Not, Repository } from 'typeorm';
import { Auth } from 'src/auth/auth/entities/register';
import * as ExcelJS from 'exceljs';
import { console } from 'inspector';
@Injectable()
export class TaskService {
  constructor(@InjectRepository(Task) private taskRepository: Repository<Task>,
  @InjectRepository(Auth) private userRepository: Repository<Auth>
  
  ,@InjectRepository(Auth) private authRepository: Repository<Auth>
){}
/**
 * 
 * @param createTaskDto
 * @method Post
 * @description create task
 */
async  createtask(createTaskDto: CreateTaskDto , userId: number) {
  
    const user = await this.authRepository.findOne({
      where: { id: userId },
      select: ['id', 'name', 'email', 'role']
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newTask =  this.taskRepository.create({
      ...createTaskDto,
      createdBy: user,
    });

    const savedTask = await this.taskRepository.save(newTask);

    return {
      status: 200,
      data: savedTask
    };
  }
  
  /**
   * 
   * @method Get
   * @description get dashboard data
   * 
   */
 async getDashboardData() {
    const totalTasks = await this.taskRepository.count();
    const pendingTasks = await this.taskRepository.count({ where: { status: 'pending' } });
    const inProgressTasks = await this.taskRepository.count({ where: { status: 'inprogress' } });
    const completedTasks = await this.taskRepository.count({ where: { status: 'completed' } });
    const overdueTasks = await this.taskRepository.count({
      where: { dueDate: LessThan(new Date()), status: Not('completed') },
    });
  
    return {
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks,
    };
  }

  /**
   * 
   * @param userId 
   * @method Get
   * @description get user dashboard data
   * @returns 
   */
async  getUserDashboardData(userId: number) {
    const userTasks = await this.taskRepository.find({
      
      where: [
        { createdBy: { id: userId } },
        { assignedTo: { id: userId } },
      ],
      relations: ['createdBy', 'assignedTo'],
      select: {
        createdBy: { id: true, name: true, email: true },
        assignedTo: { id: true, name: true, email: true },
      }
    });
  
    return userTasks;
  }
/**
 * 
 * @method Get
 * @description get all tasks
 */
  async getAllTasks(): Promise<any> {
    // Fetch all tasks with their relationships
    //the same quary
    const tasks = await this.taskRepository.find({
      relations: ['createdBy', 'assignedTo', 'todochecklist'], // Include all necessary relationships
    });
  
    // Calculate progress for each task
    const tasksWithProgress = tasks.map((task) => {
      const totalTodos = task.todochecklist.length;
      const completedTodos = task.todochecklist.filter((todo) => todo.completed).length;
  
      // Calculate progress as a percentage
      const progress = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;
  
      return {
        ...task,
        progress: parseFloat(progress.toFixed(2)), // Round to 2 decimal places
      };
    });
  
    return tasksWithProgress;
  }

  /**
   * 
   * @method Get
   * @description get task by id
   * @param id 
   * @param userId 
   * @returns 
   */
async  getTaskById(id: number , userId: number) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['createdBy', 'assignedTo', 'todochecklist'],
      select: {
        createdBy: { id: true, name: true, email: true },
        assignedTo: { id: true, name: true, email: true },
      }
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    const isCreator = task.createdBy.id === userId;
  const isAssigned = task.assignedTo.some((user) => user.id === userId);

  if (!isCreator && !isAssigned) {
    throw new ForbiddenException('You are not authorized to view this task');
  }
    return task;
    
  }

  /**
   * 
   * @description update task
   * @method Put
   * @param id 
   * @param updateTaskDto 
   * @param userId 
   * @returns 
   */
 async updatetask(id: number, updateTaskDto: UpdateTaskDto , userId: number) {
  const task = await this.taskRepository.findOne({
    where: { id },
    relations: ['createdBy', 'assignedTo'],
    select: {
      createdBy: { id: true, name: true, email: true },
      assignedTo: { id: true, name: true, email: true },
    }
    // Include createdBy and assignedTo relationships
  });

  if (!task) {
    throw new NotFoundException('Task not found');
  }
  const isCreator = task.createdBy.id === userId;
  const isAssigned = task.assignedTo.some((user) => user.id === userId);

  if (!isCreator && !isAssigned) {
    throw new ForbiddenException('You are not authorized to update this task');
  }
  console.log(updateTaskDto.assignedToIds);
  if(updateTaskDto.assignedToIds){
    console.log(updateTaskDto.assignedToIds);
    const usersToAssign = await this.authRepository.find({
      where: { id: In(updateTaskDto.assignedToIds) }, 
      select: ['id' , 'name', 'email'] // Find all users by their IDs
    });
  
    if (!usersToAssign) {
      throw new BadRequestException('One or more user IDs are invalid');
    }
  
    // Update the assignedTo array
    task.assignedTo = usersToAssign;
  }
  task.status = updateTaskDto.status || task.status;
  task.priority = updateTaskDto.priority || task.priority;
  task.progress = updateTaskDto.progress || task.progress;
  task.description = updateTaskDto.description || task.description;

  // Authorization check: Ensure the user is either the creator or an assignee
 
  
const taskupdated = await this.taskRepository.save(task);
  // Save the updated task
  return taskupdated;
}
  
/**
 * 
 * @param id 
 * @description delete task
 * @method Delete
 * @param req 
 * @returns 
 */
  async deleteTask(id: number , req :any) {
    // Fetch the task with its relationships
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['createdBy', 'assignedTo'], // Include createdBy and assignedTo relationships
    });
  
    if (!task) {
      throw new NotFoundException('Task not found');
    }
  
    // Authorization check: Ensure the user is the creator of the task or an admin
    const isCreator = task.createdBy.id === req.user.id;
    const isAdmin = req.user.role === 'admin'; // Assuming role is part of the JWT payload
  
    if (!isCreator && !isAdmin) {
      throw new ForbiddenException('You are not authorized to delete this task');
    }
    const result = await this.taskRepository.delete(id);
  
    // Delete the task
    return {
      status: 200,
      message: 'Task deleted successfully',
    };
  }
  
 

}
