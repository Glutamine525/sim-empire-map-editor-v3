import { NextRequest, NextResponse } from 'next/server';
import errorCatcher from './error-catcher';
import sessionLoader from './session-loader';

export type MiddlewareHandler = (req: NextRequest) => Promise<NextResponse>;

const M = {
  sessionLoader,
};

type MiddleWareNames = keyof typeof M;

export function use(
  ...keys: MiddleWareNames[]
): (handler: MiddlewareHandler) => MiddlewareHandler {
  if (keys.length === 0) {
    return handler => errorCatcher(handler);
  }
  return handler =>
    errorCatcher(
      execute(
        ...keys.filter((key, i) => {
          return keys.indexOf(key) === i;
        }),
      )(handler),
    );
}

function execute(
  ...keys: MiddleWareNames[]
): (handler: MiddlewareHandler) => MiddlewareHandler {
  if (keys.length === 1) {
    return handler => M[keys[0]](handler);
  }
  return handler => M[keys[0]](use(...keys.slice(1))(handler));
}
