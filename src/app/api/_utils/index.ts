import { NextResponse } from 'next/server';
import { ErrorCode, ErrorText } from '../../../protocol/error-code';

export function genRes<T extends { code: number; message: string; data?: any }>(
  code: ErrorCode,
  data?: T['data'],
  init?: ResponseInit,
): NextResponse<T> {
  return NextResponse.json(
    {
      code: code,
      message: ErrorText[code],
      data,
    } as any,
    init,
  );
}
