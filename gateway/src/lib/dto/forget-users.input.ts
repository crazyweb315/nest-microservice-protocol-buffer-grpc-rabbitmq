import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class ForgetUsersInput {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty()
  @MaxLength(30)
  email: string;
}
