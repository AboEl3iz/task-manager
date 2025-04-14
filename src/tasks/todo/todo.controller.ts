import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards , Request, Query, ParseBoolPipe, Res, Header } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import {  UpdateTodoDtoStatus } from './dto/update-todo.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { Response } from 'express';
@Controller('/api/todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post("/create/:id")
  create(@Body() createTodoDto: CreateTodoDto , @Param('id') taskId: number) {
    return this.todoService.create(createTodoDto , taskId);
  }


  @Patch('/:todoid')
  @UseGuards(AuthGuard)
  updatetaskchecklist(@Param('todoid') id: string,@Query('taskId') taskId: number,@Query('status', ParseBoolPipe) completed: boolean,  @Body() updateTodoDto: UpdateTodoDtoStatus , @Request() req) {
    return this.todoService.updateTodoStatus(taskId , +id , completed  , req.user.id);
  }

  @Get('/excel')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
@Header('Content-Disposition', 'attachment; filename=tasks-report.xlsx')
async  getTasksTest(@Res() res: Response) {
    const buffer=await this.todoService.exportTasksToExcel();
    res.send(buffer);
  }
}
