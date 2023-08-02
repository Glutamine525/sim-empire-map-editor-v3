import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  console.log(
    JSON.stringify(
      {
        test: req.nextUrl.searchParams.get('test'),
        qq: req.nextUrl.searchParams.get('qq'),
      },
      null,
      '  ',
    ),
  );

  return NextResponse.json({ name: 'ha' });
}
