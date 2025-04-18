import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthService } from 'src/auth/auth/auth.service';
import { AuthModule } from 'src/auth/auth/auth.module';
import { Auth } from 'src/auth/auth/entities/register';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/tasks/task/entities/task.entity';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([Auth,Task]),
  ],
})
export class UserModule {}
