import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { status as Status } from '@grpc/grpc-js';

@Catch(RpcException)
export class GrpcExceptionFilter implements ExceptionFilter {
  static GrpcStatusCode: Record<number, number> = {
    [Status.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST,
    [Status.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
    [Status.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
    [Status.NOT_FOUND]: HttpStatus.NOT_FOUND,
    [Status.ALREADY_EXISTS]: HttpStatus.CONFLICT,
    [Status.ABORTED]: HttpStatus.GONE,
    [Status.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
    [Status.CANCELLED]: 499,
    [Status.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
    [Status.UNIMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
    [Status.UNKNOWN]: HttpStatus.BAD_GATEWAY,
    [Status.UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
    [Status.DEADLINE_EXCEEDED]: HttpStatus.GATEWAY_TIMEOUT,
    [Status.OUT_OF_RANGE]: HttpStatus.PAYLOAD_TOO_LARGE,
    [Status.FAILED_PRECONDITION]: HttpStatus.PRECONDITION_FAILED,
  };

  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const grpcError = exception.getError();
    let code: number;
    if (
      typeof grpcError === 'object' &&
      grpcError !== null &&
      'code' in grpcError
    ) {
      code = (grpcError as any).code; // Type assertion
    } else {
      code = Status.UNKNOWN; // DEFAULT TO UNKNOWN
    }

    console.log('grpcError here=', code);

    const status =
      GrpcExceptionFilter.GrpcStatusCode[code] ?? HttpStatus.BAD_GATEWAY; // Assuming 400 for gRPC errors

    response.status(status).json({
      statusCode: status,
      message: grpcError,
    });
  }
}
