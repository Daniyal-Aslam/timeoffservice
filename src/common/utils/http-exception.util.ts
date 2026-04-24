import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

export function handleServiceError(error: any): never {
  // Known HTTP exception → pass through
  if (error instanceof HttpException) {
    throw error;
  }

  // Axios / external service error
  if (error?.response) {
    throw new HttpException(
      {
        message: error.response.data?.message || 'External service error',
        details: error.response.data,
      },
      error.response.status || HttpStatus.BAD_GATEWAY,
    );
  }

  // Prisma / DB error
  if (error?.code) {
    throw new HttpException(
      {
        message: 'Database error',
        code: error.code,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  // Fallback
  throw new InternalServerErrorException({
    message: 'Something went wrong',
  });
}