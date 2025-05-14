import { randomUUID } from 'crypto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatuses } from '../enums/task-status.enum';

@Schema({ timestamps: true, collection: 'tasks' })
export class Task {
  @ApiProperty({
    description: 'Unique identifier for the distribution subscriber',
    example: '6748311e20b49e848f710448',
  })
  @Prop({ default: () => randomUUID() })
  id: string;

  @ApiProperty({
    description: 'Unique identifier for the project task is related to',
    example: '6748311e20b49e848f710448',
    required: true,
  })
  @Prop({ required: true })
  projectId: string;

  @ApiProperty({
    description: 'Task name',
    example: 'Initialize project',
    required: true,
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'Current status of the task',
    example: TaskStatuses.NEW,
    enum: TaskStatuses,
    default: TaskStatuses.NEW,
  })
  @Prop({ type: String, enum: TaskStatuses, default: TaskStatuses.NEW })
  status: TaskStatuses;

  @ApiProperty({
    description: 'Task deadline',
    example: new Date(),
  })
  @Prop({ type: Date })
  dateTo: Date;

  @ApiProperty({
    description: 'Date when the distribution subscription was created',
    example: new Date(),
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'Date when the user was last updated',
    example: new Date(),
  })
  updatedAt?: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
