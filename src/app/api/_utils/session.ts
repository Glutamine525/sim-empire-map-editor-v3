import { NextResponse } from 'next/server';
import { COOKIE_KEY_SESSION } from './const';
import { decrypt, encrypt } from './crypto';
import { genRandomCode } from './random';

export function encodeSession(phone: string) {
  return encrypt(
    `${genRandomCode(6)}.${Date.now()}.${phone}.${genRandomCode(6)}`,
  );
}

export function decodeSession(session: string) {
  return decrypt(session).split('.').slice(1, 3);
}

export function setSession(phone: string, res: NextResponse) {
  res.cookies.set({
    name: COOKIE_KEY_SESSION,
    value: encodeSession(phone),
    path: '/',
    httpOnly: true,
    secure: true,
    expires: Date.now() + 1000 * 3600 * 24 * 30,
  });
}
