import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserRequest, UserResponse } from './interfaces/user.interface';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod('UserService', 'CreateUser')
  async createUser(data: CreateUserRequest): Promise<UserResponse> {
    return this.usersService.createUser(data);
  }

  @GrpcMethod('UserService', 'GetUser')
  async getUser(id: string): Promise<UserResponse> {
    return this.usersService.getUser(id);
  }
}
