import {
  ConflictException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateProjectDto } from '../dto/create-project.dto';
import { DefaultResponse } from 'src/common/interfaces/responses';
import { Project } from '../entities/project.entity';
import { ProjectsRepository } from '../repositories/projects.repository';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { ProjectTask } from '../dto/project-task.dto';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(private readonly projectsRepository: ProjectsRepository) {}

  public async findProjectById(id: string): Promise<Project> {
    const projectToUpdate = await this.projectsRepository.findOneById(id);

    if (!projectToUpdate) {
      throw new NotFoundException(`Project ${id} does not exist`);
    }

    return projectToUpdate;
  }

  public async findAllProjects(): Promise<Project[]> {
    return await this.projectsRepository.findAllProjects();
  }

  public async createProject(
    createProjectDto: CreateProjectDto,
  ): Promise<DefaultResponse<Project>> {
    const { name } = createProjectDto;

    const isProjectExists = await this.projectsRepository.existsByName(name);

    if (isProjectExists)
      throw new ConflictException(`Project ${name} already exist`);

    const newProjectObject = {
      ...createProjectDto,
      Projects: [],
    };

    const createdProject =
      await this.projectsRepository.create(newProjectObject);

    return {
      message: `Project ${name} created successfully`,
      statusCode: HttpStatus.OK,
      data: createdProject,
    };
  }

  public async updateById(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<DefaultResponse<Project>> {
    const projectToUpdate = await this.findProjectById(id);

    const updatedProject = await this.projectsRepository.updateById(
      projectToUpdate.id,
      updateProjectDto,
    );

    return {
      message: `Project ${updatedProject?.name} update successfully`,
      statusCode: HttpStatus.OK,
      data: updatedProject,
    };
  }

  public async addTaskToProject(
    id: string,
    task: ProjectTask,
  ): Promise<DefaultResponse<Project>> {
    const projectToUpdate = await this.findProjectById(id);

    const updatedTasksArray = [...projectToUpdate.tasks, task];

    const updatedProject = await this.projectsRepository.updateById(
      projectToUpdate?.id,
      {
        tasks: updatedTasksArray,
      },
    );

    return {
      message: `Task ${task?.name} added to project ${projectToUpdate?.name} successfully`,
      statusCode: HttpStatus.OK,
      data: updatedProject,
    };
  }

  public async updateProjectTask(
    projectId: string,
    taskName: string,
    updatedTask: ProjectTask,
  ): Promise<DefaultResponse<Project>> {
    const projectToUpdate = await this.findProjectById(projectId);

    const duplicateName = projectToUpdate.tasks.find(
      (task) => task.name === updatedTask.name && task.name !== taskName,
    );

    if (duplicateName) {
      throw new ConflictException(
        `Task with name "${updatedTask.name}" already exists in project.`,
      );
    }

    const updatedTasksArray = projectToUpdate.tasks.map((task) =>
      task.name === taskName ? updatedTask : task,
    );

    const updatedProject = await this.projectsRepository.updateById(projectId, {
      tasks: updatedTasksArray,
    });

    return {
      message: `Task "${taskName}" in project "${projectToUpdate.name}" successfully updated`,
      statusCode: HttpStatus.OK,
      data: updatedProject,
    };
  }

  public async removeTaskFromProject(
    id: string,
    taskName: string,
  ): Promise<DefaultResponse<Project>> {
    const projectToUpdate = await this.findProjectById(id);

    const updatedTasksArray = projectToUpdate.tasks.filter(
      (task) => task.name !== taskName,
    );

    const updatedProject = await this.projectsRepository.updateById(
      projectToUpdate?.id,
      {
        tasks: updatedTasksArray,
      },
    );

    return {
      message: `Task ${taskName} removed from project ${projectToUpdate?.name} successfully`,
      statusCode: HttpStatus.OK,
      data: updatedProject,
    };
  }

  public async removeProjectById(id: string): Promise<DefaultResponse<null>> {
    const projectToDelete = await this.findProjectById(id);

    await this.projectsRepository.deleteById(projectToDelete?.id);

    return {
      message: `Project ${projectToDelete?.name} and all related tasks deleted successfully`,
      statusCode: HttpStatus.OK,
    };
  }
}
