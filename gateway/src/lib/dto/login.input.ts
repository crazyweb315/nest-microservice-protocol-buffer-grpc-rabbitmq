import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class LoginInput {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
