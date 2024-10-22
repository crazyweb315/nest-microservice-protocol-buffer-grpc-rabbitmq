import { Injectable, Logger } from '@nestjs/common';
import { ChannelWrapper, connect } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { RabbitMQConfig, Exchange } from './rabbit.config';
import { StateService } from './state.service';
import { ProducerService } from './producer.service';
import { WebsocketsGateway } from '@providers/websocket/websockets.gateway';

@Injectable()
export class ConsumerService {
  private channelWrapper: ChannelWrapper;
  private logger = new Logger(ConsumerService.name);
  constructor(
    private readonly rabbitConfig: RabbitMQConfig,
    private readonly stateService: StateService,
    private readonly producerService: ProducerService,
    private readonly websocketsGateway: WebsocketsGateway,
  ) {
    this.initialize();
  }

  private initialize() {
    const connection = connect([this.rabbitConfig.uri]);
    this.channelWrapper = connection.createChannel({
      setup: async (channel: ConfirmChannel) => {
        await Promise.all(
          this.rabbitConfig.exchanges.recipient.map((exchange: Exchange) => {
            return channel.assertExchange(exchange.name, 'topic', {
              durable: true,
            });
          }),
        );
        await Promise.all(
          this.rabbitConfig.exchanges.recipient.map((exchange: Exchange) => {
            return channel.assertQueue(exchange.queue, {
              durable: true,
            });
          }),
        );

        await Promise.all(
          this.rabbitConfig.exchanges.recipient.map((exchange: Exchange) => {
            return channel.bindQueue(
              exchange.queue,
              exchange.name,
              exchange.topic,
            );
          }),
        );

        await channel.bindQueue('deadLetterQueue', 'dlx', 'dlx-routing-key');

        await channel.consume('projectQueue', async (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString());
            this.logger.log('Received message from projectQueue:', content);
            this.onProjectCreated(content);
            channel.ack(message);
          }
        });

        await channel.consume('deadLetterQueue', async (message) => {
          if (message) {
            // We can send dead messages back to the queue if you want.
            //this.producerService.addToQueue(message, exchange);
            await this.stateService.addCountOverdue();
            channel.ack(message);
          }
        });

        this.logger.log('Channel setup completed for ConsumerService.');
      },
    });
  }

  onProjectCreated(message: any) {
    // Call the broadcast function on the WebSocket Gateway
    this.websocketsGateway.broadcastProjectInfo(message);
  }

  async close() {
    await this.channelWrapper.close();
  }
}
