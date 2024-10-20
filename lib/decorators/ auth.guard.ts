import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from '../../src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the gRPC context
    const metadata = context.getArgByIndex(1);
    // Get the authorization token from metadata
    const headerToken = metadata?.get('authorization')?.[0] as string;
    if (
      !headerToken ||
      headerToken.split(' ').length !== 2 ||
      headerToken.split(' ')[0] !== 'Bearer'
    ) {
      console.log('canActivate here');

      return false;
    }
    const token = headerToken.split(' ')?.[1];
    const user = await this.usersService.getUserByToken(token);
    if (!user) {
      return false;
    }
    return true;
  }
}
