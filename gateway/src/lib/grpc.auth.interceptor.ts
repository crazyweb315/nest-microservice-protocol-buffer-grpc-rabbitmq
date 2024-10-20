import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class GrpcAuthInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const token = context.switchToHttp()?.getRequest()?.headers?.[
      'authorization'
    ];

    const request = context.switchToRpc().getContext(); // Get the gRPC call context
    // Assuming you have a way to get the token (like from a global variable or request context)

    const metadata = new Metadata();
    metadata.add('Authorization', token);

    // Set the metadata for the request (this depends on your setup)
    request.metadata = metadata;

    return next.handle().pipe(); // Continue processing the call
  }
}
