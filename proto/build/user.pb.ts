// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.181.2
//   protoc               v3.20.3
// source: user.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "account";

export interface Empty {
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse | undefined;
}

export interface CreateUserRequest {
  /** Name of the user */
  name: string;
  /** Username for the user */
  username: string;
  /** Password for the user */
  password: string;
  /** Email address of the user */
  email: string;
  /** Optional bio for the user */
  bio: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  bio: string;
  name: string;
}

export interface UserList {
  users: UserResponse[];
}

export interface GetUserRequest {
  id: string;
}

export interface DeleteUserRequest {
  id: string;
}

export const ACCOUNT_PACKAGE_NAME = "account";

export interface UserServiceClient {
  createUser(request: CreateUserRequest): Observable<UserResponse>;

  getUser(request: GetUserRequest): Observable<UserResponse>;

  deleteUser(request: DeleteUserRequest): Observable<UserResponse>;

  findUsers(request: Empty): Observable<UserList>;

  login(request: LoginRequest): Observable<LoginResponse>;
}

export interface UserServiceController {
  createUser(request: CreateUserRequest): Promise<UserResponse> | Observable<UserResponse> | UserResponse;

  getUser(request: GetUserRequest): Promise<UserResponse> | Observable<UserResponse> | UserResponse;

  deleteUser(request: DeleteUserRequest): Promise<UserResponse> | Observable<UserResponse> | UserResponse;

  findUsers(request: Empty): Promise<UserList> | Observable<UserList> | UserList;

  login(request: LoginRequest): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createUser", "getUser", "deleteUser", "findUsers", "login"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";