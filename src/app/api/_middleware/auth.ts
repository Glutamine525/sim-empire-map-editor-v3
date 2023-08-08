import { ErrorCode } from '@/protocol/error-code';
import { genRes } from '../_utils';
import { COOKIE_KEY_SESSION } from '../_utils/const';
import { MiddlewareHandler } from './';

export default function auth(handler: MiddlewareHandler): MiddlewareHandler {
  return async req => {
    const session = req.cookies.get(COOKIE_KEY_SESSION);
    if (!session?.value) {
      return genRes(ErrorCode.LoginRequired);
    }
    return handler(req);
  };
}
