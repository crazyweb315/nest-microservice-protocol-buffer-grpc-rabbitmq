import { UtilsService } from '@lib/utils/utils.service';
import { Injectable } from '@nestjs/common';
import { Project } from '@prisma/client';
import { CreateProjectRequest, ProjectResponse } from '@proto/project.pb';
import { ProducerService } from '@providers/amqp/producer.service';
import { PrismaService } from '@providers/prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly producerService: ProducerService,
  ) {}

  async createProject(data: CreateProjectRequest): Promise<ProjectResponse> {
    const project: Project = await this.prisma.project.create({
      data,
    });
    const ret = {
      ...project,
      user: null,
      createdAt: UtilsService.dateToTimestamp(project.createdAt),
      updatedAt: UtilsService.dateToTimestamp(project.updatedAt),
    };

    this.producerService.addToQueue(ret);
    return ret;
  }

  async getProject(id: string): Promise<ProjectResponse> {
    const project = await this.prisma.project.findUnique({
      select: {
        id: true,
        title: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        user: true,
      },
      where: { id },
    });

    return {
      ...project,
      user: project.user,
      createdAt: UtilsService.dateToTimestamp(project.createdAt),
      updatedAt: UtilsService.dateToTimestamp(project.updatedAt),
    };
  }
}
