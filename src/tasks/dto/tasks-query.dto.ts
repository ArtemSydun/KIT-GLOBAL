import { IsOptional, IsString, IsEnum } from 'class-validator';
import { TaskStatuses } from '../enums/task-status.enum';

export class FindTasksQueryDto {
  @IsOptional()
  @IsEnum(TaskStatuses)
  status?: TaskStatuses;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'name';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}
