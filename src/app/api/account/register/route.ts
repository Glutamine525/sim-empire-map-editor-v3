import { NextRequest, NextResponse } from 'next/server';
import { RegisterReq, RegisterRes } from '@/protocol/account';
import { AccountErrorCode, AccountErrorText } from '../../_utils/error-code';
import { LOGIN_CODE_REGEXP, PHONE_REGEXP } from '../../_utils/regexp';

export async function POST(
  req: NextRequest,
): Promise<NextResponse<RegisterRes>> {
  const { phone, code, password } = (await req.json()) as RegisterReq;

  if (!phone || !code || !password) {
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

  if (typeof code !== 'string' || !LOGIN_CODE_REGEXP.test(code)) {
    return NextResponse.json({
      code: AccountErrorCode.ParamsError,
      message: AccountErrorText[AccountErrorCode.ParamsError],
    });
  }

  if (typeof password !== 'string') {
    return NextResponse.json({
      code: AccountErrorCode.ParamsError,
      message: AccountErrorText[AccountErrorCode.ParamsError],
    });
  }

  return NextResponse.json({
    code: AccountErrorCode.Success,
    message: AccountErrorText[AccountErrorCode.Success],
  });
}
