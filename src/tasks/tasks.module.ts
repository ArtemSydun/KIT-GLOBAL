import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './services/tasks.service';

import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './entities/task.entity';

import { TasksRepository } from './repositories/tasks.repository';
import { TasksController } from './controllers/tasks.controller';
import { ProjectsModule } from 'src/project/projects.module';
import { UsersModule } from 'src/user/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    ProjectsModule,
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository],
  exports: [TasksService],
})
export class TasksModule {}
