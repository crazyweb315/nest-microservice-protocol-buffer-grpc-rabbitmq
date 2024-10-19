import {
  INestApplication,
  INestMicroservice,
  Inject,
  Injectable,
  OnModuleInit,
  Optional,
} from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaServiceOptions } from './interfaces';
import { PRISMA_SERVICE_OPTIONS } from './prisma.constants';

@Injectable()
export class PrismaService
  extends PrismaClient<
    Prisma.PrismaClientOptions,
    'query' | 'info' | 'warn' | 'error'
  >
  implements OnModuleInit
{
  constructor(
    @Optional()
    @Inject(PRISMA_SERVICE_OPTIONS)
    private readonly prismaServiceOptions: PrismaServiceOptions = {},
  ) {
    super(prismaServiceOptions.prismaOptions);

    if (this.prismaServiceOptions.middlewares) {
      this.prismaServiceOptions.middlewares.forEach((middleware) =>
        this.$use(middleware),
      );
    }
  }

  async onModuleInit() {
    if (this.prismaServiceOptions.explicitConnect) {
      await this.$connect();
    }
  }

  async enableShutdownHooks(app: INestApplication | INestMicroservice) {
    app.enableShutdownHooks(); // Enable shutdown hooks for the application

    process.on('SIGINT', async () => {
      await this.$disconnect(); // Disconnect from the Prisma client
      await app.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await this.$disconnect(); // Disconnect from the Prisma client
      await app.close();
      process.exit(0);
    });
  }
}
