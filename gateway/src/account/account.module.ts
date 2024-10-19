import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: process.env.ACCOUNT_MICRO_NAME || `ACCOUNT_MICROSERVICE`,
        transport: Transport.GRPC,
        options: {
          url: 'node_1:50051',
          package: process.env.ACCOUNT_MICRO_PACKAGE || 'account',
          protoPath: './proto/user.proto',
        },
      },
    ]),
  ],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
