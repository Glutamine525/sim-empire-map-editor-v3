import { NextResponse } from 'next/server';
import { ErrorCode, ErrorText } from './error-code';

export function genRes<T = any>(code: ErrorCode, data?: any): NextResponse<T> {
  return NextResponse.json({
    code: code,
    message: ErrorText[code],
    data,
  } as any);
}
