import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { ProjectsService } from '../services/projects.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  getSchemaPath,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/auth.role.decorator';
import {
  ApiCustomUnathorizedResponse,
  ApiCustomForbiddenResponse,
} from 'src/common/decorators/swagger.decorators';
import { DefaultResponse } from 'src/common/interfaces/responses';
import { UserRoles } from 'src/user/enums/role.enum';
import { Task } from 'src/tasks/entities/task.entity';
import { Project } from '../entities/project.entity';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.superadmin, UserRoles.admin)
  @Post('')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Post new project (admins only)',
    description: 'Post new project.',
  })
  @ApiOkResponse({
    description: 'Project ${name} created successfuly',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Project ${name} created successfuly',
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
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<DefaultResponse<Project>> {
    return this.projectsService.createProject(createProjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all projects',
    description: 'Get all projects.',
  })
  @ApiOkResponse({
    description: 'All projects',
    type: [Project],
  })
  @ApiCustomUnathorizedResponse()
  @ApiCustomForbiddenResponse()
  findAll(): Promise<Project[]> {
    return this.projectsService.findAllProjects();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.admin, UserRoles.superadmin)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update project by id (admins only)',
    description: 'Update project.',
  })
  @ApiOkResponse({
    description: 'Project ${name} updated successfuly',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Project ${name} updated successfuly',
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
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<DefaultResponse<Project>> {
    return this.projectsService.updateById(id, updateProjectDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.admin, UserRoles.superadmin)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete project (admins only)',
    description: 'Delete project',
  })
  @ApiOkResponse({
    description: 'Project ${name} and all related tasks deleted successfully',
  })
  @ApiNotFoundResponse()
  remove(@Param('id') id: string): Promise<DefaultResponse<null>> {
    return this.projectsService.removeProject(id);
  }
}
