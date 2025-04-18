import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { loginAuthDto } from './dto/login_auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/register';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(@InjectRepository(Auth) private authRepository: Repository<Auth>,
    private jwtService: JwtService) { }

  /**
   * @access public
   * @method Post
   * @description create user
   * @param createAuthDto 
   * @returns 
   */
  async create(createAuthDto: CreateAuthDto) {
    if (!createAuthDto.email || !createAuthDto.password || !createAuthDto.name) {
      return {
        status: 400,
        message: "All Fields are required",
      }
    }
    let user = await this.authRepository.findOne({ where: { email: createAuthDto.email } });
    if (user) {
      return {
        status: 400,
        message: "User Already Exists",
      }

    }
    console.log(`${createAuthDto.roletoken} ---| ${process.env.adminToken} --| ${Number(createAuthDto.roletoken) === Number(process.env.adminToken)}`);
    let hashPassword = await this.hashPassword(createAuthDto.password);
    console.log(hashPassword);
    let result = await this.authRepository.create({
      email: createAuthDto.email,
      name: createAuthDto.name,
      password: hashPassword,
    });
    if(createAuthDto.roletoken && (Number(createAuthDto.roletoken) === Number(process.env.adminToken))){
      result.role = "admin";

    }
    await this.authRepository.save(result);
    return {
      status: 200,
      message: "User Created Successfully",
      data: result
    };
  }

 
/**
   * @access public
   * @method Post
   * @description login user
   * @param loginAuthDto 
   * @returns 
   */
  async findOne(loginAuthDto: loginAuthDto) {
    if (!loginAuthDto.email || !loginAuthDto.password) {
      return {
        status: 400,
        message: "All Fields are required",
      }
    }
    let user = await this.authRepository.findOne({ where: { email: loginAuthDto.email } });
    if (!user) {
      return {
        status: 400,
        message: "User Not Found",
      }
    }
    let checkPassword = bcrypt.compare(loginAuthDto.password, user.password);
    if (!checkPassword) {
      return {
        status: 400,
        message: "Password is incorrect",
      }
    }

    let token = this.generateToken(user);

    return {
      status: 200,
      message: "Login Successfully",
      data: {  token }
    };
  }

 

  private hashPassword(password: string): Promise<string> {
    let salt = 10;
    return  bcrypt.hash(password, salt);
  }
  private generateToken(user: any) {
    return this.jwtService.sign({ id: user.id, role: user.role }, {
      secret: process.env.secret,
      expiresIn: '1d',
    }
    );

  }
}
