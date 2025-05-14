import {
  ConflictException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { DefaultResponse } from 'src/common/interfaces/responses';
import { Task } from '../entities/task.entity';
import { TasksRepository } from '../repositories/tasks.repository';
import { ProjectsService } from 'src/project/services/projects.service';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { FindTasksQueryDto } from '../dto/tasks-query.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly projectsService: ProjectsService,
    private readonly tasksRepository: TasksRepository,
  ) {}

  public async createTask(
    projectId: string,
    createTaskDto: CreateTaskDto,
  ): Promise<DefaultResponse<Task>> {
    const { name } = createTaskDto;

    const relatedProject =
      await this.projectsService.findProjectById(projectId);

    if (relatedProject?.tasks?.find((task) => task?.name === name)) {
      throw new ConflictException(
        `Task ${name} already exists in project ${relatedProject?.name}`,
      );
    }

    const createdTask = await this.tasksRepository.create(createTaskDto);

    return {
      message: `Task ${name} created successfully`,
      statusCode: HttpStatus.OK,
      data: createdTask,
    };
  }

  public async findAllTasks(query: FindTasksQueryDto): Promise<Task[]> {
    return this.tasksRepository.findAllTasks(query);
  }

  public async findTaskById(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOneById(id);

    if (!task) {
      throw new NotFoundException(`Task ${id} does not exist`);
    }

    return task;
  }

  public async findTaskInProjectByName(
    projectId: string,
    taskName: string,
  ): Promise<Task> {
    const task = await this.tasksRepository.findByProjectAndTaskName(
      projectId,
      taskName,
    );

    if (!task) {
      throw new NotFoundException(
        `Task ${taskName} does not exist in project ${projectId}`,
      );
    }

    return task;
  }

  public async updateTaskById(
    id: string,
    updateDistributionDto: UpdateTaskDto,
  ): Promise<DefaultResponse<Task>> {
    const taskToUpdate = await this.findTaskById(id);

    const existsByName = await this.tasksRepository.findByProjectAndTaskName(
      taskToUpdate?.projectId,
      updateDistributionDto?.name,
    );

    if (existsByName) {
      throw new ConflictException(
        `Task ${updateDistributionDto?.name} already exist`,
      );
    }

    const updatedTask = await this.tasksRepository.updateById(
      taskToUpdate?.id,
      updateDistributionDto,
    );

    await this.projectsService.updateProjectTask(
      taskToUpdate?.projectId,
      taskToUpdate?.name,
      updatedTask,
    );

    return {
      message: `Task ${id} updated successfully`,
      statusCode: HttpStatus.OK,
      data: updatedTask,
    };
  }

  public async removeTaskById(id: string): Promise<DefaultResponse<null>> {
    const taskToDelete = await this.findTaskById(id);

    await this.tasksRepository.deleteById(taskToDelete?.id);

    await this.projectsService.removeTaskFromProject(
      taskToDelete?.projectId,
      taskToDelete?.name,
    );

    return {
      message: `Task ${taskToDelete?.id} deleted successfully`,
      statusCode: HttpStatus.OK,
    };
  }
}
