import { Module } from '@nestjs/common';
import { ProducerService } from '@providers/amqp/producer.service';
import { RabbitMQConfig } from '@providers/amqp/rabbit.config';
import { ConsumerService } from './consumer.service';
import { WebsocketsGatewayModule } from '@providers/websocket/websockets.module';
import { StateService } from './state.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [WebsocketsGatewayModule, CacheModule.register({ ttl: 0 })],
  providers: [ConsumerService, ProducerService, RabbitMQConfig, StateService],
})
export class RabbitMQModule {}
