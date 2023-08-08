import { NextRequest, NextResponse } from 'next/server';
import { LoginReq, LoginRes, LoginType } from '@/protocol/account';
import { redis } from '../../_infra/redis';
import { AccountErrorCode, AccountErrorText } from '../../_utils/error-code';
import { LOGIN_CODE_REGEXP, PHONE_REGEXP } from '../../_utils/regexp';

export async function POST(req: NextRequest): Promise<NextResponse<LoginRes>> {
  const { type, phone, code, password } = (await req.json()) as LoginReq;

  if (![LoginType.Code, LoginType.Password].includes(type)) {
    return NextResponse.json({
      code: AccountErrorCode.ParamsError,
      message: AccountErrorText[AccountErrorCode.ParamsError],
    });
  }

  if (!phone) {
    return NextResponse.json({
      code: AccountErrorCode.ParamsError,
      message: AccountErrorText[AccountErrorCode.ParamsError],
    });
  }

  if (typeof phone !== 'string' || !PHONE_REGEXP.test(phone)) {
    return NextResponse.json({
      code: AccountErrorCode.ParamsError,
      message: AccountErrorText[AccountErrorCode.ParamsError],
    });
  }

  if (type === LoginType.Code) {
    if (typeof code !== 'string' || !LOGIN_CODE_REGEXP.test(code)) {
      return NextResponse.json({
        code: AccountErrorCode.ParamsError,
        message: AccountErrorText[AccountErrorCode.ParamsError],
      });
    }
    const cachedCode = await redis.get(`${phone}:code`);
    if (!cachedCode || cachedCode !== code) {
      return NextResponse.json({
        code: AccountErrorCode.CodeError,
        message: AccountErrorText[AccountErrorCode.CodeError],
      });
    }
  }

  if (type === LoginType.Password) {
    if (typeof password !== 'string') {
      return NextResponse.json({
        code: AccountErrorCode.ParamsError,
        message: AccountErrorText[AccountErrorCode.ParamsError],
      });
    }
  }

  return NextResponse.json(
    {
      code: AccountErrorCode.Success,
      message: AccountErrorText[AccountErrorCode.Success],
    },
    {
      status: 200,
      headers: { 'Set-Cookie': `session=${phone}` },
    },
  );
}
