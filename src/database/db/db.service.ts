import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { NeonDbError } from '@neondatabase/serverless';

/**
 * Defines a mapping from database error codes to HTTP exception details.
 */
export interface DbErrorMapping {
  [errorCode: string]: {
    message: string;
    status: HttpStatus;
  };
}

@Injectable()
export class DbService {
  /** Map of database user-friendly error codes to error codes */
  static readonly ERROR_CODES = {
    UNIQUE_VIOLATION: '23505',
  } as const;

  /**
   * Throws an HTTP exception based on the provided DB error mapping.
   * @param error - The error encountered.
   * @param errorMapping - An object mapping error codes to their corresponding HTTP responses.
   * @throws HttpException based on error type or mapping.
   */
  handleDbError(error: unknown, errorMapping: DbErrorMapping): never {
    if (!(error instanceof NeonDbError)) {
      throw new HttpException(
        'Unknown error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
    for (const code in errorMapping) {
      if (
        Object.prototype.hasOwnProperty.call(errorMapping, code) &&
        error['code'] === code
      ) {
        const { message, status } = errorMapping[code];
        throw new HttpException(message, status, { cause: error });
      }
    }
    throw new HttpException('Unknown database error', HttpStatus.BAD_REQUEST, {
      cause: error,
    });
  }
}
