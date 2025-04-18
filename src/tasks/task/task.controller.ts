import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RoleGuard } from 'src/guards/role/role.guard';

@Controller('/api/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post("/create")
  @UseGuards(AuthGuard)
  createtask(@Body() createTaskDto: CreateTaskDto, @Request() req) {

    return this.taskService.createtask(createTaskDto , req.user.id);
  }

  @Get("/dashboard-data")
  @UseGuards(RoleGuard)
  getDashboardData() {
    return this.taskService.getDashboardData();
  }
  @Get("/user-dashboard-data")
  @UseGuards(AuthGuard)
  getUserDashboardData( @Request() req) {
    return this.taskService.getUserDashboardData(req.user.id);
  }
  @Get('/all')
  @UseGuards(RoleGuard)
  getTasks() {
    return this.taskService.getAllTasks();
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  getTaskById(@Param('id') id: string ,  @Request() req) {
    return this.taskService.getTaskById(+id , req.user.id);
  }

  @Patch('/update-task/:id')
  @UseGuards(AuthGuard)
  updatetask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Request() req) {
    return this.taskService.updatetask(+id, updateTaskDto , req.user.id);
  }
  
  

  @Delete('/delete-task/:id')
  @UseGuards(AuthGuard)
  deletetask(@Param('id') id: number , @Request() req) {
    return this.taskService.deleteTask(id,req);
  }
 
  
}
