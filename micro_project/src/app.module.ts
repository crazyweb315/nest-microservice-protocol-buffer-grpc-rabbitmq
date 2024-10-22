import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectController } from './project/project.controller';
import { ProjectService } from './project/project.service';
import { ProjectModule } from './project/project.module';
import { LoggerModule } from '@lib/logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule, loggingMiddleware, QueryInfo } from '@providers/prisma';
import { UtilsModule } from '@lib/utils/utils.module';
import { ProducerService } from '@providers/amqp/producer.service';
import { RabbitMQConfig } from '@providers/amqp/rabbit.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.dev', '.env.stage', '.env.prod'],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log', // default is `debug`
            logMessage: (query: QueryInfo) =>
              `[Prisma Query] ${query.model}.${query.action} - ${query.executionTime}ms`,
          }),
        ],
      },
    }),
    ProjectModule,
    LoggerModule,
    UtilsModule,
  ],
  controllers: [AppController, ProjectController],
  providers: [AppService, ProjectService, ProducerService, RabbitMQConfig],
})
export class AppModule {}
