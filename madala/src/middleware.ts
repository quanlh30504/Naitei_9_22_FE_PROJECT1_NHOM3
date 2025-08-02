import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Để AdminAccess component xử lý authentication và authorization
  // Middleware chỉ log để debug
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log('Admin route accessed:', request.nextUrl.pathname);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
