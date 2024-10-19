import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from '@providers/prisma/prisma.module';
import {
  loggingMiddleware,
  QueryInfo,
} from '@providers/prisma/middlewares/logging.middleware';
import { createUserMiddleware } from '@providers/prisma/middlewares/create-user.middleware';
import { LoggerModule } from '@lib/logger/logger.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
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
          createUserMiddleware(),
        ],
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.dev', '.env.stage', '.env.prod'],
    }),
    UsersModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
