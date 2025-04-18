import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { loginAuthDto } from './dto/login_auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/register")
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  @Post("/login")
  findOne(@Body() loginAuthDto: loginAuthDto) {
    return this.authService.findOne(loginAuthDto);
  }

 
}
