import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GrpcAuthInterceptor } from './lib/grpc.auth.interceptor';
import { ProjectModule } from './project/project.module';
import { WebsocketsGatewayModule } from '@providers/websocket/websockets.module';
import { RabbitMQModule } from '@providers/amqp/amqp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.dev', '.env.stage', '.env.prod'],
    }),
    RabbitMQModule,
    AccountModule,
    ProjectModule,
    WebsocketsGatewayModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR, // Use APP_INTERCEPTOR to apply globally
      useClass: GrpcAuthInterceptor,
    },
  ],
})
export class AppModule {}
