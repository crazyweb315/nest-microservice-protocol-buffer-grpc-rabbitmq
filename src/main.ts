import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'grpc',
        protoPath: 'proto/user.proto',
        url: 'localhost:5000',
      },
    },
  );

  await app.listen();
}
bootstrap();
