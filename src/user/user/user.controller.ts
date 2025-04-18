import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Request, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RoleGuard } from 'src/guards/role/role.guard';


@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  

  @Get("all")
  @UseGuards(RoleGuard)
  findAll(@Request () req ) {
   console.log(req.user);
    return this.userService.findAll();
  }

  @Get("/profile")
  @UseGuards(AuthGuard)
  findOne(@Request () req ) {
    return this.userService.findOne(req.user.id);
  }

  @Get("/user/:id")
  @UseGuards(RoleGuard)
  getuserbyid(@Param('id', ParseIntPipe) id: number ) {
    return this.userService.getuserbyid(id);
  }

  @Delete("/delete/:id")
  @UseGuards(RoleGuard)
  deleteuser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @Patch("/update-profile")
  @UseGuards(AuthGuard)
  update(@Request () req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  
}
