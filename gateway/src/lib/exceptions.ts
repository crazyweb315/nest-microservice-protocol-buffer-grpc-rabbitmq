import { RpcException } from '@nestjs/microservices';

export class LoginInputException extends RpcException {
  constructor() {
    super('username or email must be provided');
  }
}

export class UserNotExitException extends RpcException {
  constructor() {
    super('User not exists');
  }
}

export class WrongPassword extends RpcException {
  constructor() {
    super('Wrong password');
  }
}

export class Exception extends RpcException {
  constructor(error) {
    super(error);
  }
}

export class UniqueException extends RpcException {
  constructor() {
    super('Username or password must be unique');
  }
}

export class UnAuthorizedException extends RpcException {
  constructor(error = 'UnAuthorized User') {
    super(error);
  }
}
