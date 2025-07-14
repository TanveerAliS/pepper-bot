import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const token = url.searchParams.get('authToken');

  const allowedTokens = process.env.ALLOWED_TOKENS?.split(',') || [];

  if (!token || !allowedTokens.includes(token)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/chat/:path*', '/api/:path*'],
};
