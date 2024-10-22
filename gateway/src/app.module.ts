import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GrpcAuthInterceptor } from './lib/grpc.auth.interceptor';
import { ProjectModule } from './project/project.module';
import { ProducerService } from '@providers/amqp/producer.service';
import { ConsumerService } from '@providers/amqp/consumer.service';
import { StateService } from '@providers/amqp/state.service';
import { RabbitMQConfig } from '@providers/amqp/rabbit.config';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.dev', '.env.stage', '.env.prod'],
    }),
    AccountModule,
    ProjectModule,
    CacheModule.register({ ttl: 0 }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR, // Use APP_INTERCEPTOR to apply globally
      useClass: GrpcAuthInterceptor,
    },
    ProducerService,
    ConsumerService,
    RabbitMQConfig,
    StateService,
  ],
})
export class AppModule {}
