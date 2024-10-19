import { IsNotEmpty, IsString } from 'class-validator';

export class TokenInput {
  @IsNotEmpty()
  @IsString()
  token: string;
}
