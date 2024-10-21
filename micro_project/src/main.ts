import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { Http2gRPCExceptionFilter } from '@lib/grpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: process.env.PROJECT_MICRO_PACKAGE || `project`,
        protoPath: 'proto/project.proto',
        url: 'localhost:5001',
      },
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform the payload to DTO instances
      whitelist: true, // Strip non-whitelisted properties
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
    }),
  );

  // Use global exception filter
  app.useGlobalFilters(new Http2gRPCExceptionFilter());
  await app.listen();
}
bootstrap();
