import { IsMongoId } from 'class-validator';

export class MongoId {
  @IsMongoId()
  id: string;
}
