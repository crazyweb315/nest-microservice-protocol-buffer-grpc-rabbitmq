import { CreateUsersInput } from './dto/create-users.input';
import { Controller, Post, Body } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateUserRequest } from '@proto/user.pb';
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUsersInput) {
    return this.accountService.createUser(createUserDto as CreateUserRequest);
  }
}
