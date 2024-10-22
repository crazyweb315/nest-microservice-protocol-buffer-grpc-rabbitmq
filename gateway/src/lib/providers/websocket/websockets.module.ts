// src/gateway/websockets.module.ts

import { Module } from '@nestjs/common';
import { WebsocketsGateway } from './websockets.gateway';

@Module({
  providers: [WebsocketsGateway],
  exports: [WebsocketsGateway],
})
export class WebsocketsGatewayModule {}
