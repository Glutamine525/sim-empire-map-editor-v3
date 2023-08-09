import { NextRequest, NextResponse } from 'next/server';
import { InfoRes } from '@/protocol/account';
import { ErrorCode } from '@/protocol/error-code';
import { use } from '../../_middleware';
import { genRes } from '../../_utils';
import { setSession } from '../../_utils/session';

async function handler(req: NextRequest): Promise<NextResponse<InfoRes>> {
  const phone = req.cookies.get('phone')!.value;
  const setAt = Number(req.cookies.get('setAt')!.value);

  const res = genRes(ErrorCode.Success, { data: { test: '123' } });
  if (setAt + 1000 * 3600 * 24 * 20 < Date.now()) {
    setSession(phone, res);
  }
  return res;
}

export const GET = use('sessionLoader')(handler);
