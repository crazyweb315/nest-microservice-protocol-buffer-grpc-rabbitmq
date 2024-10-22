import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { filterRequest } from './middleware/filter.request.middleware';
import * as dotenv from 'dotenv';
import { GrpcExceptionFilter } from './middleware/grpc.exception.filter.middleware';
import { GrpcAuthInterceptor } from './lib/grpc.auth.interceptor';
import FastifySocketIO from 'fastify-socket.io';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  app.use(filterRequest);

  const configService = app.get(ConfigService);
  const globalPrefix = configService.get('BACKEND_PREFIX');
  app.setGlobalPrefix(globalPrefix);

  if (configService.get('ENVIRONMENT') === 'development' || 'stage') {
    const swaggerOptions = new DocumentBuilder()
      .setTitle('Microservice API documentation')
      .setDescription(
        'Below You can test out the backend api and read the description of all endpoints and it`s examples',
      )
      .setVersion('0.0.1')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'jwt',
      })
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);

    SwaggerModule.setup(globalPrefix + '/doc', app, swaggerDocument, {
      swaggerUrl: `${configService.get('BACKEND_HOST')}/api/docs-json/`,
      explorer: true,
      swaggerOptions: {
        docExpansion: 'list',
        filter: true,
        displayRequestDuration: true,
      },
      customCss:
        '.opblock-summary-path {font-size: 18px !important; font-weight: normal !important;}' +
        '.opblock-summary-description {font-size: 18px !important; text-align: right !important;' +
        'font-weight: bold !important;}',
    });
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
    }),
  );
  app.useGlobalFilters(new GrpcExceptionFilter());
  app.useGlobalInterceptors(new GrpcAuthInterceptor());
  // app.enableCors({
  //   origin: true,
  // });
  // Initialize Socket.IO with Fastify
  const port = configService.get('BACKEND_PORT');
  await app.listen(port);
}
bootstrap();
