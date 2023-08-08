import { NextRequest, NextResponse } from 'next/server';
import SmsClient, { SendSmsRequest } from '@alicloud/dysmsapi20170525';
import { Config } from '@alicloud/openapi-client';
import { SmsCodeReq, SmsCodeRes } from '@/protocol/account';
import { redis } from '../../_infra/redis';
import { genRes } from '../../_utils';
import { ACCOUNT_CODE_EXPIRE } from '../../_utils/const';
import { ErrorCode } from '../../_utils/error-code';
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

export async function POST(
  req: NextRequest,
): Promise<NextResponse<SmsCodeRes>> {
  // const phone = req.nextUrl.searchParams.get('phone');
  const { phone } = (await req.json()) as SmsCodeReq;

  if (!phone) {
    return genRes(ErrorCode.ParamsError);
  }

  if (typeof phone !== 'string' || !PHONE_REGEXP.test(phone)) {
    return genRes(ErrorCode.ParamsError);
  }

  const code = Array(6)
    .fill(0)
    .map(() => Math.floor(Math.random() * 10))
    .join('');

  if (process.env.NODE_ENV === 'development') {
    redis.setEx(`${phone}:code`, ACCOUNT_CODE_EXPIRE, code);
    return genRes(ErrorCode.Debug);
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
