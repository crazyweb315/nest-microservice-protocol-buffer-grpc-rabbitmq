import { UtilsService } from '@lib/utils/utils.service';
import { Injectable } from '@nestjs/common';
import { Project } from '@prisma/client';
import { CreateProjectRequest, ProjectResponse } from '@proto/project.pb';
import { PrismaService } from '@providers/prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async createProject(data: CreateProjectRequest): Promise<ProjectResponse> {
    const project: Project = await this.prisma.project.create({
      data,
    });

    return {
      ...project,
      user: null,
      createdAt: UtilsService.dateToTimestamp(project.createdAt),
      updatedAt: UtilsService.dateToTimestamp(project.updatedAt),
    };
  }
}
