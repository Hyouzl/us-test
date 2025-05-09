import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const timestamp = new Date().toISOString();

    const status = exception.getStatus();
    const err = exception.getResponse() as
      | { message: any; statusCode: number }
      // class-validator에서 발생한 에러
      | { error: string; statusCode: 400; message: string[] };

    if (typeof err !== 'string') {
      const errorDetail = err.message as string;
      // class-validator에서 발생한 에러 처리
      if (err.statusCode === 400) {
        return response.status(status).json({
          statusCode: status,
          errorMsg: '요청한 데이터 형식을 확인해주세요.',
          errorDetail,
        });
      } else if (err.statusCode === 500) {
        return response.status(status).json({
          statusCode: status,
          errorDetail,
        });
      } else if (err.statusCode === 404) {
        const errorDetail = err.message as string;
        return response.status(status).json({
          statusCode: status,
          errorDetail,
          method: request.method,
          path: request.url,
          time: timestamp,
        });
      }
    }
  }
}
