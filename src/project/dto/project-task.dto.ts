import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { TaskStatuses } from 'src/tasks/enums/task-status.enum';

export class ProjectTask {
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
  dateTo: Date;
}
