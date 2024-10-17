import { HttpException, HttpStatus } from '@nestjs/common';
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

export class Exception extends HttpException {
  constructor(error, errorCode = HttpStatus.BAD_REQUEST) {
    super(error, errorCode);
  }
}

export class UnAuthorizedException extends HttpException {
  constructor(error = 'UnAuthorized User', errorCode = HttpStatus.BAD_REQUEST) {
    super(error, errorCode);
  }
}
