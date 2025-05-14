import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';

@Injectable()
export class TasksRepository {
  constructor(
    @InjectModel(Task.name)
    private TaskModel: Model<Task>,
  ) {}

  async findOneById(id: string): Promise<Task> {
    return this.TaskModel.findOne({ id }).lean().exec();
  }

  async findByProjectAndTaskName(projectId: string, taskName): Promise<Task> {
    return this.TaskModel.findOne({ projectId, name: taskName }).lean().exec();
  }

  async findAllProjectTasks(projectId: string): Promise<Task[]> {
    return this.TaskModel.find({ where: { projectId } }).lean().exec();
  }

  async findAllTasks(): Promise<Task[]> {
    return this.TaskModel.find().lean().exec();
  }

  async existsByName(name: string): Promise<boolean> {
    const task = await this.TaskModel.findOne({ name }).lean().exec();
    return task !== null;
  }

  async create(task: CreateTaskDto): Promise<Task> {
    return await this.TaskModel.create(task);
  }

  async updateById(id: string, updateData: Partial<Task>): Promise<Task> {
    const updatedTask = await this.TaskModel.findOneAndUpdate(
      { id },
      { $set: updateData },
      { new: true, lean: true },
    ).exec();

    return updatedTask;
  }

  async deleteById(id: string): Promise<void> {
    await this.TaskModel.findOneAndDelete({ id });
    return;
  }

  async deleteAllProjectTasksById(projectId: string): Promise<void> {
    await this.TaskModel.deleteMany({ projectId });
  }
}
