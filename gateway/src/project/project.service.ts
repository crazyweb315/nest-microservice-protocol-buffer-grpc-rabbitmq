import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { CreateProjectRequest, ProjectServiceClient } from '@proto/project.pb';
import { lastValueFrom } from 'rxjs';
import { Exception } from 'src/lib/exceptions';
import { ProjectResultDto } from './dto/project.result.dto';
import { UtilsService } from 'src/lib/utils/utils.service';

@Injectable()
export class ProjectService implements OnModuleInit {
  private projectServiceClient: ProjectServiceClient;
  constructor(
    @Inject('ProjectService') private readonly clientGrpc: ClientGrpc,
  ) {}

  public onModuleInit(): void {
    this.projectServiceClient =
      this.clientGrpc.getService<ProjectServiceClient>('ProjectService');
  }

  async createProject(data: CreateProjectRequest): Promise<ProjectResultDto> {
    try {
      const project = await lastValueFrom(
        this.projectServiceClient.createProject(data),
      );
      return {
        ...project,
        user: null,
        createdAt: UtilsService.timestampToDate(project.createdAt),
        updatedAt: UtilsService.timestampToDate(project.updatedAt),
      };
    } catch (e) {
      console.log('create project error=', e);
      throw new Exception(e);
    }
  }
}
