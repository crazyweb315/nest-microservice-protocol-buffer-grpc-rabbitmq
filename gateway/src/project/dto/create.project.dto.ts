import { IsMongoId, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title: string;
  @IsMongoId()
  userId: string;
}
