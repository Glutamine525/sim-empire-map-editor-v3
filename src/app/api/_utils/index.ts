import { NextResponse } from 'next/server';
import { ErrorCode, ErrorText } from '../../../protocol/error-code';

export function genRes<T extends { code: number; message: string; data?: any }>(
  code: ErrorCode,
  option?: { message?: string; data?: T['data']; init?: ResponseInit },
): NextResponse<T> {
  return NextResponse.json(
    {
      code: code,
      message: option?.message || ErrorText[code],
      data: option?.data,
    } as any,
    option?.init,
  );
}
