import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from '../entities/project.entity';
import { CreateProjectDto } from '../dto/create-project.dto';

@Injectable()
export class ProjectsRepository {
  constructor(
    @InjectModel(Project.name)
    private ProjectModel: Model<Project>,
  ) {}

  async findOneById(id: string): Promise<Project> {
    return this.ProjectModel.findOne({ id }).lean().exec();
  }

  async findAllProjects(): Promise<Project[]> {
    return this.ProjectModel.find().lean().exec();
  }

  async existsByName(name: string): Promise<boolean> {
    const project = await this.ProjectModel.findOne({ name }).lean().exec();
    return project !== null;
  }

  async create(project: CreateProjectDto): Promise<Project> {
    return await this.ProjectModel.create(project);
  }

  async updateById(id: string, updateData: Partial<Project>): Promise<Project> {
    const updatedProject = await this.ProjectModel.findOneAndUpdate(
      { id },
      { $set: updateData },
      { new: true, lean: true },
    ).exec();

    return updatedProject;
  }

  async deleteById(id: string): Promise<void> {
    await this.ProjectModel.findOneAndDelete({ id });
    return;
  }
}
