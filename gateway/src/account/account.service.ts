import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  CreateUserRequest,
  LoginRequest,
  LoginResponse,
  UserResponse,
  AccountServiceClient,
} from '@proto/user.pb';
import { Exception, UnAuthorizedException } from 'src/lib/exceptions';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AccountService implements OnModuleInit {
  private accountServiceClient: AccountServiceClient;
  constructor(
    @Inject('AccountService') private readonly clientGrpc: ClientGrpc,
  ) {}

  public onModuleInit(): void {
    this.accountServiceClient =
      this.clientGrpc.getService<AccountServiceClient>('AccountService');
  }

  async getUser({
    id,
    token,
  }: {
    id: string;
    token: string;
  }): Promise<UserResponse> {
    try {
      if (!token) {
        throw new UnAuthorizedException();
      }
      return await lastValueFrom(this.accountServiceClient.getUser({ id }));
    } catch (e) {
      throw new Exception(e);
    }
  }

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

  async login(loginInput: LoginRequest): Promise<LoginResponse> {
    try {
      return await lastValueFrom(this.accountServiceClient.login(loginInput));
    } catch (e) {
      throw new Exception(e);
    }
  }
}
