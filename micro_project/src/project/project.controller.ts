import { Controller } from '@nestjs/common';
import { ProjectService } from './project.service';
import { GrpcMethod } from '@nestjs/microservices';
import { ProjectResponse } from '@proto/project.pb';
import { CreateProjectDto } from './dto/create.project.dto';
import { MongoId } from '@lib/dto/id';
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @GrpcMethod('ProjectService', 'CreateProject')
  async createProject(project: CreateProjectDto): Promise<ProjectResponse> {
    return this.projectService.createProject(project);
  }

  @GrpcMethod('ProjectService', 'GetProject')
  async getProject(id: MongoId): Promise<ProjectResponse> {
    return this.projectService.getProject(id.id);
  }
}
