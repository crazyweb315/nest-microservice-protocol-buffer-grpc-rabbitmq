import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type Exchange = {
  name: string;
  topic: string;
  queue?: string;
};

export type Exchanges = {
  recipient: Exchange[];
  sender: Exchange[];
};

@Injectable()
export class RabbitMQConfig {
  public readonly uri: string;
  public exchanges: Exchanges;

  constructor() {
    const configService = new ConfigService();

    this.uri = configService.get('RABBIT_URI');
    this.exchanges = {
      recipient: [],
      sender: [
        {
          name: 'notify.user',
          topic: 'project.create',
          queue: 'projectQueue',
        },
      ],
    };
  }
}
