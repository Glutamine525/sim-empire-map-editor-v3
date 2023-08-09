import { NextResponse } from 'next/server';
import { BaseRes } from '@/protocol';
import { ErrorCode, ErrorText } from '@/protocol/error-code';

type DataType<T> = T extends { data: infer U } ? U : never;

export function genRes<T extends BaseRes & { data: U }, U = DataType<T>>(
  code: ErrorCode,
  option?: { message?: string; data?: U; init?: ResponseInit },
): NextResponse<T> {
  return NextResponse.json(
    {
      code,
      message: option?.message || ErrorText[code],
      data: option?.data,
    } as any,
    option?.init,
  );
}
