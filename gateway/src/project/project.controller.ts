import { Controller, Post, Body } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create.project.dto';
import { ProjectResultDto } from './dto/project.result.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<ProjectResultDto> {
    return this.projectService.createProject(createProjectDto);
  }
}
