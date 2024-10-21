import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { UtilsService } from '@lib/utils/utils.service';

@Module({
  providers: [ProjectService, UtilsService],
  controllers: [ProjectController],
})
export class ProjectModule {}
