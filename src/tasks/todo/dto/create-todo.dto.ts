import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateTodoDto {
    @IsString()
    @IsNotEmpty({ message: 'title is required' })
        title: string;

    @IsNotEmpty({ message: 'completed is required' })
    @IsBoolean()
        completed: boolean;
       
}
