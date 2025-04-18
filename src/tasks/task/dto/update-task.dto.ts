
import { IsArray, IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto {
    @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['pending', 'inprogress', 'completed'])
  status?: string;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: string;

  

  @IsOptional()
  @IsNumber()
  progress?: number;

  @IsOptional()
  @IsArray()
  assignedToIds: number[];
}
