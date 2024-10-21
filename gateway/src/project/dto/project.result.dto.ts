import { UserResponse } from '@proto/user.pb';

export class ProjectResultDto {
  title: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user: UserResponse;
}
