import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsString } from 'class-validator';
import { TaskStatuses } from '../enums/task-status.enum';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task name',
    example: 'Initialize project',
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'Current status of the task',
    example: TaskStatuses.NEW,
    enum: TaskStatuses,
    default: TaskStatuses.NEW,
  })
  @IsEnum(TaskStatuses)
  status: TaskStatuses;

  @ApiProperty({
    description: 'Task deadline',
    example: new Date(),
  })
  @IsDate()
  dateTo: Date;
}
