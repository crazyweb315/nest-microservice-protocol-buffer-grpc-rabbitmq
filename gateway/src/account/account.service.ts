import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CreateUserRequest,
  UserResponse,
  UserServiceClient,
} from '@proto/user.pb';
import { Exception } from 'src/lib/exceptions';
import { lastValueFrom } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable()
export class AccountService implements OnModuleInit {
  private accountServiceClient: UserServiceClient;
  constructor(@Inject('UserService') private readonly clientGrpc: ClientGrpc) {}

  public onModuleInit(): void {
    this.accountServiceClient =
      this.clientGrpc.getService<UserServiceClient>('UserService');
  }

  // getUser(createUsersInput: CreateUsersInput) {
  //   return this.accountClient.send<UserResponse, CreateUserRequest>(
  //     'GetUser',
  //     createUsersInput,
  //   );
  // }

  async createUser(createUsersInput: CreateUserRequest): Promise<UserResponse> {
    try {
      return await lastValueFrom(
        this.accountServiceClient.createUser(createUsersInput),
      );
    } catch (e) {
      console.log('create user error=', e);
      throw new Exception(e);
    }
  }
}
