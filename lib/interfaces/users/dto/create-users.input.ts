import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateUsersInput {
  @IsString()
  @MaxLength(30)
  name: string;

  @IsString()
  @MaxLength(30)
  username: string;

  @IsString()
  @MaxLength(60)
  @IsNotEmpty()
  password: string;

  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty()
  @MaxLength(30)
  email: string;

  @IsString()
  @MaxLength(60)
  @IsOptional()
  bio?: string;
}
