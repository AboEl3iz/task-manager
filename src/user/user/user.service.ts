import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/auth/auth/entities/register';
import * as bcrypt from 'bcrypt';
import { Task } from 'src/tasks/task/entities/task.entity';
@Injectable()
export class UserService {
  constructor(@InjectRepository(Auth) private userRepository: Repository<Auth>,
  @InjectRepository(Task) private taskRepository: Repository<Task>) {}
  
/**
 * @access private 
 * @method Get
 * @description get all users
 * @returns 
 */
  async findAll() {
    // let userslist = await this.userRepository.find();
    const usersWithTaskCounts = await this.userRepository
  .createQueryBuilder("user")
  .leftJoin("user.assignedTasks", "task")
  .select("user.id", "id")
  .addSelect("user.name", "name")
  .addSelect("user.email", "email")
  .addSelect(`COUNT(CASE WHEN task.status = 'pending' THEN 1 END)`, "pendingCount")
  .addSelect(`COUNT(CASE WHEN task.status = 'inprogress' THEN 1 END)`, "inProgressCount")
  .addSelect(`COUNT(CASE WHEN task.status = 'completed' THEN 1 END)`, "completedCount")
  .groupBy("user.id")
  .addGroupBy("user.name")
  .addGroupBy("user.email")
  .getRawMany();
    return {
      status: 200,
      message: "User List",
      data: usersWithTaskCounts,
    }
  }

  /**
   * @access private token
   * @method Get
   * @description get user profile
   * @param id 
   * @returns
   */
 async findOne(id: number) {
    let user = await this.userRepository.createQueryBuilder("user")
    .select(["user.id", "user.name", "user.email"]).where("user.id = :id", { id })
    .getOne();
    return {
      status: 200,
      data: user
    };
  }

  /**
   * @access private admin
   * @method Get
   * @description get user by id
   * @param id 
   * @returns
   */
 async getuserbyid(id: number) {
  let user = await this.userRepository.createQueryBuilder("user")
  .select(["user.id", "user.name", "user.email"]).where("user.id = :id", { id })
  .getOne();
  if(!user) throw new HttpException('User Not Found', 404);
  return {
    status: 200,
    data: user
  };
}

/**
 * @method Patch
 * @description update user
 * @param id 
 * @param updateUserDto 
 * @returns 
 */
 async update(id: number, updateUserDto: UpdateUserDto) {
    let user = await this.userRepository.createQueryBuilder("user")
    .select(["user.id", "user.name", "user.email"]).where("user.id = :id", { id })
    .getOne();
    if(!user) throw new HttpException('User Not Found', 404);
    user.name = updateUserDto.name || user.name;
    if (updateUserDto.password) {
      let hashPassword = await this.hashPassword(updateUserDto.password);
      user.password = hashPassword || user.password;
    }
   let result = await this.userRepository.save(user);
    return {
      status: 200,
      data: result
    };
  }
/**
 * @access private admin 
 * @method Delete
 * @description delete user
 * @param id 
 * @returns 
 */
async remove(id: number) {
  let user = await this.userRepository.delete(id);
  return {
    status: 200,
    message: "User Deleted",
  };
}
   private hashPassword(password: string): Promise<string> {
      let salt = 10;
      return  bcrypt.hash(password, salt);
    }
}
