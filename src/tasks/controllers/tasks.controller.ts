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
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  getSchemaPath,
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
    summary: 'Get all tasks',
    description: 'Get all tasks.',
  })
  @ApiOkResponse({
    description: 'All tasks',
    type: [Task],
  })
  @ApiCustomUnathorizedResponse()
  findAll(): Promise<Task[]> {
    return this.tasksService.findAllTasks();
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
