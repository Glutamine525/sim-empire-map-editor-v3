import { ErrorCode } from './error-code';

export interface BaseRes {
  code: ErrorCode;
  message: string;
}
