import HTTPCodes from '@/enum/http-codes.enum';
import { RequestHandlerError } from './request-handler.error';

export class BadRequestError extends RequestHandlerError {
  statusCode: number = HTTPCodes.BadRequest;
  errorMessage: string;

  constructor(message: string) {
    super(message);
    this.name = 'BadRequest';
    this.errorMessage = message;
  }
}
