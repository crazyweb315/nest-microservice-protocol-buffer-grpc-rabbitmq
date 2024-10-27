import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '@providers/prisma/prisma.service';
import { LoginResponse } from '@proto/user.pb';
import {
  UserNotExitException,
  WrongPassword,
  Exception,
  LoginInputException,
  UnAuthorizedException,
  UniqueException,
} from '@lib/exceptions';
import { User } from '@prisma/client';
import { JWTPayload } from '@interfaces/users/jwt-payload.interface';
import jwtConfig from '@lib/config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { LoggerService } from '@lib/logger/logger.service';
import { LoginInput } from '@interfaces/users/dto/login.input';
import { BcryptService } from '@lib/hashing/bcrypt.service';
import { TokenInput } from '@interfaces/users/dto/token.input';
import { CreateUsersInput } from '@interfaces/users/dto/create-users.input';
import { UserList, UserResponse } from '@proto/user.pb';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private bcryptService: BcryptService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly logger: LoggerService,
  ) {}

  async createUser(data: CreateUsersInput): Promise<UserResponse> {
    try {
      return await this.prisma.user.create({
        data: {
          name: data.name,
          username: data.username,
          email: data.email,
          password: data.password, // Make sure to hash the password before storing!
          bio: data.bio || null, // Convert undefined to null      },
        },
      });
    } catch (e) {
      this.logger.error('Create User:', e);
      throw new UniqueException();
    }
  }

  async login(loginInput: LoginInput): Promise<LoginResponse> {
    try {
      if (!loginInput.email && !loginInput.username) {
        throw new LoginInputException();
      }

      let user: User = null;

      if (loginInput.username) {
        user = await this.findUserByUserName(loginInput.username);
      } else {
        user = await this.findUserByEmail(loginInput.email);
      }

      if (!user) {
        throw new UserNotExitException();
      }

      const isValidPassword = await this.bcryptService.compare(
        loginInput.password,
        user.password,
      );

      if (!isValidPassword) {
        throw new WrongPassword();
      }

      return this.generateTokens(user);
    } catch (e) {
      this.logger.error('login error', e, loginInput);
      throw new Exception(e);
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findUserByUserName(username: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findAllUsers(): Promise<UserList> {
    const users = await this.prisma.user.findMany({});
    return { users };
  }

  async deleteUser(id: string): Promise<Omit<User, 'password'>> {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (e) {
      this.logger.error('findAllUsers', e);
      throw new UserNotExitException();
    }
  }

  async getUser(id: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new UserNotExitException();
    }

    return user;
  }

  async generateTokens(user: UserResponse) {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.signToken<Partial<JWTPayload>>(
          user.id,
          this.jwtConfiguration.accessTokenTtl,
          { email: user.email },
        ),
        this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl),
      ]);
      return {
        accessToken,
        refreshToken,
        user,
      };
    } catch (e) {
      this.logger.error(e, 'generateTokens error:');
      throw new Exception(e);
    }
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  public async getUserByToken(token: string): Promise<UserResponse> {
    try {
      const { sub } = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      const user = await this.getUser(sub);
      return user;
    } catch (e) {
      this.logger.error(e, `getUserByTOken error ${token}`);
      throw new Exception(e);
    }
  }

  async refreshTokens(tokenInput: TokenInput): Promise<LoginResponse> {
    try {
      const user = await this.getUserByToken(tokenInput.token);
      return this.generateTokens(user);
    } catch (e) {
      this.logger.error('refresh token error', e, tokenInput);
      throw new UnAuthorizedException(e);
    }
  }
}
