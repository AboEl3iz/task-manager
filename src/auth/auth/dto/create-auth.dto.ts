import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Unique } from "typeorm";

export class CreateAuthDto {
    @IsEmail()
    @IsNotEmpty({message:"Email is required"})
    email: string;
    @IsString()
    @IsNotEmpty({message:"Password is required"})
    @Length(5,100,{message:"Password must be at least 5 characters"})
    password: string;
    @IsString()
    @IsNotEmpty({message:"Name is required"})
    name: string
    @IsString()
    @IsOptional()
    roletoken?: string
}
