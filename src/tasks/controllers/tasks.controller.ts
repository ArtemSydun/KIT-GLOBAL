import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  Query,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  getSchemaPath,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import {
  ApiCustomUnathorizedResponse,
  ApiCustomForbiddenResponse,
  ApiCustomNotFoundResponse,
} from 'src/common/decorators/swagger.decorators';
import { DefaultResponse } from 'src/common/interfaces/responses';

import { Task } from 'src/tasks/entities/task.entity';
import { TasksService } from '../services/tasks.service';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { CreateTaskDto } from '../dto/create-task.dto';
import { FindTasksQueryDto } from '../dto/tasks-query.dto';
import { TaskStatuses } from '../enums/task-status.enum';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':projectId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Post new task',
    description: 'Post new task.',
  })
  @ApiOkResponse({
    description: 'Task ${name} created successfuly',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Task ${name} created successfuly',
        },
        statusCode: {
          type: 'number',
          example: HttpStatus.OK,
        },
        data: {
          type: 'object',
          $ref: getSchemaPath(Task),
        },
      },
    },
  })
  @ApiCustomUnathorizedResponse()
  @ApiCustomForbiddenResponse()
  create(
    @Param('projectId') projectId: string,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<DefaultResponse<Task>> {
    return this.tasksService.createTask(projectId, createTaskDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all tasks with filters',
    description:
      'Get all tasks with optional filters: status, projectId, createdAt, sort options, etc.',
  })
  @ApiOkResponse({
    description: 'Filtered tasks list',
    type: [Task],
  })
  @ApiCustomUnathorizedResponse()
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    enum: TaskStatuses,
  })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['createdAt', 'name'] })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  findAll(@Query() query: FindTasksQueryDto): Promise<Task[]> {
    return this.tasksService.findAllTasks(query);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update task by id',
    description: 'Update task.',
  })
  @ApiOkResponse({
    description: 'Task ${name} updated successfuly',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Task ${name} updated successfuly',
        },
        statusCode: {
          type: 'number',
          example: HttpStatus.OK,
        },
        data: {
          type: 'object',
          $ref: getSchemaPath(Task),
        },
      },
    },
  })
  @ApiCustomUnathorizedResponse()
  @ApiCustomNotFoundResponse('Task', 'id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<DefaultResponse<Task>> {
    return this.tasksService.updateTaskById(id, updateTaskDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete task',
    description: 'Delete task',
  })
  @ApiOkResponse({
    description: 'Task ${name} and all related tasks deleted successfully',
  })
  @ApiCustomNotFoundResponse('Task', 'id')
  remove(@Param('id') id: string): Promise<DefaultResponse<null>> {
    return this.tasksService.removeTaskById(id);
  }
}
