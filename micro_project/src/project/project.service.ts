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
      data: {
        title: data.title,
        userId: data.userId,
      },
    });

    return {
      ...project,
      createdAt: UtilsService.dateToTimestamp(project.createdAt),
      updatedAt: UtilsService.dateToTimestamp(project.updatedAt),
    };
  }
}
