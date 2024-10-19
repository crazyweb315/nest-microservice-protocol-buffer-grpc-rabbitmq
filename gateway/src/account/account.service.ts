import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUsersInput } from '@interfaces/users/dto/create-users.input';
import { CreateUserRequest, UserResponse } from '@proto/user';
@Injectable()
export class AccountService {
  constructor(
    @Inject('ACCOUNT_MICROSERVICE') private readonly accountClient: ClientProxy,
  ) {}

  // getUser(createUsersInput: CreateUsersInput) {
  //   return this.accountClient.send<UserResponse, CreateUserRequest>(
  //     'GetUser',
  //     createUsersInput,
  //   );
  // }

  createUser(createUsersInput: CreateUsersInput) {
    return this.accountClient.send<UserResponse, CreateUsersInput>(
      'CreateUser',
      createUsersInput,
    );
  }
}
