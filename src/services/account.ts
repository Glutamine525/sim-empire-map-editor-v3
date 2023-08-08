import {
  LoginReq,
  LoginRes,
  RegisterReq,
  SmsCodeReq,
  SmsCodeRes,
} from '@/protocol/account';

export async function sendSmsCode(params: SmsCodeReq) {
  const res = await fetch('/api/account/code', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: { 'Content-Type': 'application/json' },
  });
  const handledRes = (await res.json()) as SmsCodeRes;
  return handledRes;
}

export async function register(params: RegisterReq) {}

export async function login(params: LoginReq) {
  const res = await fetch('/api/account/login', {
    method: 'POST',
    body: JSON.stringify(params),
    headers: { 'Content-Type': 'application/json' },
  });
  const handledRes = (await res.json()) as LoginRes;
  return handledRes;
}
