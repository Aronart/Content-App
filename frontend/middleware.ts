import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/config') {
    return NextResponse.redirect(new URL('/config/content-flows', request.url));
  }
  return NextResponse.next();
}
