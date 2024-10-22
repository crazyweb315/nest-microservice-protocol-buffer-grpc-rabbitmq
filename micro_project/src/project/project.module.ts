import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { UtilsService } from '@lib/utils/utils.service';
import { ProducerService } from '@providers/amqp/producer.service';
import { RabbitMQConfig } from '@providers/amqp/rabbit.config';

@Module({
  providers: [ProjectService, UtilsService, ProducerService, RabbitMQConfig],
  controllers: [ProjectController],
})
export class ProjectModule {}
