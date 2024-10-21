import { CreateUsersInput } from '../lib/dto/create-users.input';
import { Controller, Post, Get, Body, Query, Headers } from '@nestjs/common';
import { AccountService } from './account.service';
import {
  CreateUserRequest,
  LoginRequest,
  LoginResponse,
  UserResponse,
} from '@proto/user.pb';
import { MongoId } from '../lib/dto/id';
import { LoginInput } from '../lib/dto/login.input';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUsersInput) {
    return this.accountService.createUser(createUserDto as CreateUserRequest);
  }

  //TODO: need to check JWT token to access this endpoint.
  @Get('user')
  async me(
    @Headers('authorization') token: string,
    @Query() id: MongoId,
  ): Promise<UserResponse> {
    return this.accountService.getUser({
      token: token?.split('Bearer ')?.[1],
      id: id.id,
    });
  }

  @Post('login')
  async login(@Body() loginDto: LoginInput): Promise<LoginResponse> {
    return this.accountService.login(loginDto as LoginRequest);
  }
}
