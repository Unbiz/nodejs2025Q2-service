import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest<Request>();
      const response = context.switchToHttp().getResponse<Response>();

      const { method, url, query, body } = request;
      const startTime = Date.now();

      this.loggingService.logRequest(url, method, query, body);

      return next.handle().pipe(
        tap(() => {
          const endTime = Date.now();
          const responseTime = endTime - startTime;

          this.loggingService.logResponse(
            url,
            method,
            response.statusCode,
            responseTime,
          );
        }),
      );
    }

    return next.handle();
  }
}
