import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class NonHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const timestamp = new Date().toISOString();

    let errorDetail: string = '예기치 못한 오류입니다.';
    const errorMsg = '서버 내부 오류가 발생했습니다.';

    // 일반 Error 객체인 경우
    if (exception instanceof Error) {
      errorDetail = exception.message;
    }

    // 기타 예외 (문자열, 객체 등)
    else if (typeof exception === 'string') {
      errorDetail = exception;
    } else if (typeof exception === 'object' && exception !== null) {
      try {
        errorDetail = JSON.stringify(exception);
      } catch {
        errorDetail = '객체를 문자열로 변환할 수 없습니다.';
      }
    }

    response.status(statusCode).json({
      statusCode,
      errorMsg,
      errorDetail,
      method: request.method,
      path: request.url,
      timestamp,
    });
  }
}
