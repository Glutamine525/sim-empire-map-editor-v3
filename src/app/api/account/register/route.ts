import { NextRequest, NextResponse } from 'next/server';
import { RegisterReq, RegisterRes } from '@/protocol/account';
import { genRes } from '../../_utils';
import { ErrorCode } from '../../_utils/error-code';
import { LOGIN_CODE_REGEXP, PHONE_REGEXP } from '../../_utils/regexp';

export async function POST(
  req: NextRequest,
): Promise<NextResponse<RegisterRes>> {
  const { phone, code, password } = (await req.json()) as RegisterReq;

  if (!phone || !code || !password) {
    return genRes(ErrorCode.ParamsError);
  }

  if (typeof phone !== 'string' || !PHONE_REGEXP.test(phone)) {
    return genRes(ErrorCode.ParamsError);
  }

  if (typeof code !== 'string' || !LOGIN_CODE_REGEXP.test(code)) {
    return genRes(ErrorCode.ParamsError);
  }

  if (typeof password !== 'string') {
    return genRes(ErrorCode.ParamsError);
  }

  return genRes(ErrorCode.Success);
}
