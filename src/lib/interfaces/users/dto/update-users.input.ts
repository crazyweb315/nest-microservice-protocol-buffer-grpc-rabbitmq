import { IsMongoId } from 'class-validator';
import { CreateUsersInput } from './create-users.input';

export class UpdateUsersInput extends CreateUsersInput {
  @IsMongoId({ message: 'ID must be a valid ObjectId' })
  id: number;
}
