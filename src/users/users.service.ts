import { Injectable } from '@nestjs/common';
import { PrismaService } from '@providers/prisma/prisma.service';
import {
  CreateUserRequest,
  UserResponse,
} from '../lib/interfaces/user.interface';
import { UserNotExitException } from '../lib/exceptions';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserRequest): Promise<UserResponse> {
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password, // Make sure to hash the password before storing!
        bio: data.bio || null, // Convert undefined to null      },
      },
    });
    return this.sanitizeUser(user);
  }

  async getUser(id: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new UserNotExitException();
    }

    return this.sanitizeUser(user);
  }

  sanitizeUser(user: User) {
    const sanitized = user;
    delete sanitized['password'];
    return sanitized;
  }
}
