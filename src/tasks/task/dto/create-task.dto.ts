import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Auth } from "src/auth/auth/entities/register";
import { Todo } from "src/tasks/todo/entities/todo.entity";


export class CreateTaskDto {
    
        @IsString()
        @IsNotEmpty({ message: 'Description is required' })
        description: string;
      
        @IsEnum(['pending', 'inprogress', 'completed'])
        
        status: string;
      
        @IsEnum(['low', 'medium', 'high'])
       
        priority: string;
      
        @IsDate()
        @IsNotEmpty({ message: 'Due date is required' })
        dueDate: Date;
      
        @IsOptional()
        @IsNumber({ allowNaN: false  })
        progress?: number;
      
        @IsOptional()
        @IsArray()
        @IsString({ each: true })
        attachments?: string[];
        
      
}
