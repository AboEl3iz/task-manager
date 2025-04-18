
import { Column } from 'typeorm';
import { CreateAuthDto } from './create-auth.dto';
import { IsEmpty, IsString } from 'class-validator';

export class loginAuthDto {
    @IsString()
    @IsEmpty({ message: 'Email is required' })
    email: string;
    @IsEmpty({ message: 'Password is required' })
    @IsString()
    password: string;
}
