// Define the structure of the requests and responses for user management

import { User } from '@prisma/client';

// CreateUserRequest interface corresponds to the CreateUser gRPC request
export type CreateUserRequest = Omit<User, 'id'>;

// UserResponse interface corresponds to the CreateUser gRPC response
export type UserResponse = Omit<User, 'password'>;
