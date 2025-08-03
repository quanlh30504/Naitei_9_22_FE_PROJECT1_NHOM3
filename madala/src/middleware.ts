/**
 * MIDDLEWARE.TS - Next.js Route Middleware
 * 
 * CHỨC NĂNG CHÍNH:
 * - Xử lý các requests trước khi đến page components hoặc API routes
 * - Hiện tại: Pass-through tất cả requests (không filter)
 * - Authentication được xử lý bởi AdminGuard component và API route protection
 * 
 * LÝ DO THIẾT KẾ:
 * - Tránh Edge Runtime conflicts với MongoDB/NextAuth
 * - Đơn giản hóa flow, để authentication logic trong components
 * - Flexible hơn cho việc handle different route types
 * 
 * TƯƠNG LAI CÓ THỂ MỞ RỘNG:
 * - Rate limiting
 * - Request logging
 * - Redirect rules
 * - CORS handling
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // For admin routes, we'll handle authentication in the components
    // This middleware just passes through all requests
    // Authentication will be handled by AdminGuard component and API route protection

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all admin routes but exclude API routes
         */
        '/admin/:path*'
    ],
};
