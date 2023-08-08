import { NextResponse } from 'next/server';
import { MiddlewareHandler } from './';

export default function errorCatcher(
  handler: MiddlewareHandler,
): MiddlewareHandler {
  return async req => {
    try {
      return handler(req);
    } catch {
      return NextResponse.json({}, { status: 500 });
    }
  };
}
