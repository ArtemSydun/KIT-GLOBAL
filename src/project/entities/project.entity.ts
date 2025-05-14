import { randomUUID } from 'crypto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectTask } from '../dto/project-task.dto';

@Schema({ timestamps: true, collection: 'projects' })
export class Project {
  @ApiProperty({
    description: 'Unique identifier for the project',
    example: '6748311e20b49e848f710448',
  })
  @Prop({ default: () => randomUUID() })
  id: string;

  @ApiProperty({
    description: 'Project name',
    example: 'GLOBAL KIT',
    required: true,
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'Project tasks',
    type: [ProjectTask],
  })
  @Prop({ type: String })
  tasks: ProjectTask[];

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

export const ProjectSchema = SchemaFactory.createForClass(Project);
