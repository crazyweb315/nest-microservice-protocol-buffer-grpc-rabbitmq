import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
//import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { PrismaModule } from '@providers/prisma/prisma.module';
import {
  loggingMiddleware,
  QueryInfo,
} from '@providers/prisma/middlewares/logging.middleware';
import { createUserMiddleware } from '@providers/prisma/middlewares/create-user.middleware';

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
    UsersModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}