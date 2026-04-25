import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

export function handleServiceError(error: any): never {
  if (error instanceof HttpException) {
    throw error;
  }

  if (error?.response) {
    throw new HttpException(
      {
        message: error.response.data?.message || 'External service error',
      },
      error.response.status || HttpStatus.BAD_GATEWAY,
    );
  }

  if (error?.code) {
    throw new HttpException(
      {
        message: 'Database error',
        code: error.code,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  throw new InternalServerErrorException('Something went wrong');
}