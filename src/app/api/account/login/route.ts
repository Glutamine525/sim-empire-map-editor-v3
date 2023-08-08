import { NextRequest, NextResponse } from 'next/server';
import { LoginReq, LoginRes, LoginType } from '@/protocol/account';
import { ErrorCode } from '../../../../protocol/error-code';
import { redis } from '../../_infra/redis';
import { genRes } from '../../_utils';
import { LOGIN_CODE_REGEXP, PHONE_REGEXP } from '../../_utils/regexp';

export async function POST(req: NextRequest): Promise<NextResponse<LoginRes>> {
  const { type, phone, code, password } = (await req.json()) as LoginReq;

  if (![LoginType.Code, LoginType.Password].includes(type)) {
    return genRes(ErrorCode.ParamsError);
  }

  if (!phone) {
    return genRes(ErrorCode.ParamsError);
  }

  if (typeof phone !== 'string' || !PHONE_REGEXP.test(phone)) {
    return genRes(ErrorCode.ParamsError);
  }

  if (type === LoginType.Code) {
    if (typeof code !== 'string' || !LOGIN_CODE_REGEXP.test(code)) {
      return genRes(ErrorCode.ParamsError);
    }
    const cachedCode = await redis.get(`${phone}:code`);
    if (!cachedCode || cachedCode !== code) {
      return genRes(ErrorCode.CodeError);
    }
  }

  if (type === LoginType.Password) {
    if (typeof password !== 'string') {
      return genRes(ErrorCode.ParamsError);
    }
  }

  return genRes(ErrorCode.Success, {
    init: { headers: { 'Set-Cookie': `session=${phone}` } },
  });
}
