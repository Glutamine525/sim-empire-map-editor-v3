import { ErrorCode } from '@/protocol/error-code';
import { genRes } from '../_utils';
import { COOKIE_KEY_SESSION } from '../_utils/const';
import { PHONE_REGEXP } from '../_utils/regexp';
import { decodeSession } from '../_utils/session';
import { MiddlewareHandler } from './';

export default function sessionLoader(
  handler: MiddlewareHandler,
): MiddlewareHandler {
  return async req => {
    const session = req.cookies.get(COOKIE_KEY_SESSION);
    if (!session?.value) {
      return genRes(ErrorCode.LoginRequired);
    }
    const [setAt, phone] = decodeSession(session.value);
    if (!PHONE_REGEXP.test(phone)) {
      return genRes(ErrorCode.LoginRequired);
    }
    req.cookies.set('phone', phone);
    req.cookies.set('setAt', setAt);
    return handler(req);
  };
}
