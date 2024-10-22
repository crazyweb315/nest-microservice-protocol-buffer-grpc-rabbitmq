import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQConfig } from '@providers/amqp/rabbit.config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: process.env.PROJECT_MICRO_NAME || `ProjectService`,
        transport: Transport.GRPC,
        options: {
          url:
            (process.env.PROJECT_MICRO_URL || `localhost`) +
            ':' +
            (process.env.PROJECT_MICRO_PORT || `5001`),
          package: process.env.PROJECT_MICRO_PACKAGE || 'project',
          protoPath: './proto/project.proto',
        },
      },
    ]),
  ],
  providers: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}
