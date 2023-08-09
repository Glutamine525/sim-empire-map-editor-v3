import { NextRequest, NextResponse } from 'next/server';
import SmsClient, { SendSmsRequest } from '@alicloud/dysmsapi20170525';
import { Config } from '@alicloud/openapi-client';
import { SmsCodeReq, SmsCodeRes } from '@/protocol/account';
import { ErrorCode } from '../../../../protocol/error-code';
import { redis } from '../../_infra/redis';
import { use } from '../../_middleware';
import { genRes } from '../../_utils';
import { ACCOUNT_CODE_EXPIRE } from '../../_utils/const';
import { genRandomCode } from '../../_utils/random';
import { PHONE_REGEXP } from '../../_utils/regexp';

const config = new Config({
  accessKeyId: process.env['ALIBABA_CLOUD_ACCESS_KEY_ID']!,
  accessKeySecret: process.env['ALIBABA_CLOUD_ACCESS_KEY_SECRET']!,
});
config.endpoint = 'dysmsapi.aliyuncs.com'; // Endpoint 请参考 https://api.aliyun.com/product/Dysmsapi
const client = new SmsClient(config);

async function sendSmsRequest(phoneNumbers: string, code: string) {
  const res = await client.sendSms(
    new SendSmsRequest({
      phoneNumbers,
      signName: '模拟帝国布局图编辑器',
      templateCode: 'SMS_283965204',
      templateParam: JSON.stringify({ code }),
    }),
  );
  return res.body;
}

async function handler(req: NextRequest): Promise<NextResponse<SmsCodeRes>> {
  // const phone = req.nextUrl.searchParams.get('phone');
  const { phone } = (await req.json()) as SmsCodeReq;

  if (!phone) {
    return genRes(ErrorCode.ParamsError);
  }

  if (typeof phone !== 'string' || !PHONE_REGEXP.test(phone)) {
    return genRes(ErrorCode.ParamsError);
  }

  const code = genRandomCode(6);

  if (process.env.NODE_ENV === 'development') {
    redis.setEx(`${phone}:code`, ACCOUNT_CODE_EXPIRE, code);
    return genRes(ErrorCode.Debug, { message: code });
  }

  const res = await sendSmsRequest(phone, code);
  if (res.code === 'OK') {
    redis.setEx(`${phone}:code`, ACCOUNT_CODE_EXPIRE, code);
    return genRes(ErrorCode.Success);
  } else if (res.code === 'isv.BUSINESS_LIMIT_CONTROL') {
    return genRes(ErrorCode.CodeLimitControl);
  }

  return genRes(ErrorCode.Unknown);
}

export const POST = use()(handler);
