import { HttpException, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export class LoginInputException extends HttpException {
  constructor() {
    super('username or email must be provided', HttpStatus.BAD_REQUEST);
  }
}

export class UserNotExitException extends HttpException {
  constructor() {
    super('User not exists', HttpStatus.FORBIDDEN);
  }
}

export class WrongPassword extends HttpException {
  constructor() {
    super('Wrong password', HttpStatus.FORBIDDEN);
  }
}

export class Exception extends RpcException {
  constructor(error) {
    super(error);
  }
}

export class UniqueException extends HttpException {
  constructor() {
    super('Username or password must be unique', HttpStatus.BAD_REQUEST);
  }
}

export class UnAuthorizedException extends HttpException {
  constructor(error = 'UnAuthorized User', errorCode = HttpStatus.BAD_REQUEST) {
    super(error, errorCode);
  }
}
