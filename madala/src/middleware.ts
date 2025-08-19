import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
    const { pathname } = request.nextUrl;
    // Nếu có lỗi xác thực (token.error), redirect về /login với mã lỗi
    if (token && typeof token === 'object' && token.error) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/login';
        loginUrl.searchParams.set('error', String(token.error));
        return NextResponse.redirect(loginUrl);
    }

    // Type guard cho token
    const isAuthToken = (t: any): t is { role?: string; isActive?: boolean } => t && typeof t === 'object';

    // Chặn user bị ban (isActive === false, không phải admin)
    if (isAuthToken(token) && token.role !== 'admin' && token.isActive === false) {
        if (pathname !== '/banned') {
            const bannedUrl = request.nextUrl.clone();
            bannedUrl.pathname = '/banned';
            bannedUrl.searchParams.set('from', pathname);
            return NextResponse.redirect(bannedUrl);
        }
        return NextResponse.next();
    }

    // Nếu user không bị ban mà vào /banned thì redirect về trang trước hoặc về trang chủ
    if (isAuthToken(token) && token.role !== 'admin' && token.isActive !== false && pathname === '/banned') {
        const from = request.nextUrl.searchParams.get('from');
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = from && from !== '/banned' ? from : '/';
        redirectUrl.searchParams.delete('from');
        return NextResponse.redirect(redirectUrl);
    }

    // Chặn user không phải admin vào /admin
    if (pathname.startsWith('/admin')) {
        if (!isAuthToken(token) || token.role !== 'admin') {
            const homeUrl = request.nextUrl.clone();
            homeUrl.pathname = '/';
            return NextResponse.redirect(homeUrl);
        }
    }

    return NextResponse.next();
}
export const config = {
    matcher: ['/admin/:path*', '/banned', '/profile/:path*'],
};
