import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
    const { pathname } = request.nextUrl;


    // Nếu user bị ban (theo JWT), redirect sang trang /banned (trừ khi đã ở /banned)
    if (token && token.role !== 'admin' && token.isActive === false) {
        if (pathname !== '/banned') {
            const bannedUrl = request.nextUrl.clone();
            bannedUrl.pathname = '/banned';
            // Lưu lại trang trước khi bị ban qua query param 'from'
            bannedUrl.searchParams.set('from', pathname);
            return NextResponse.redirect(bannedUrl);
        }
        // Nếu đã ở /banned thì cho phép truy cập
        return NextResponse.next();
    }

    // Nếu user KHÔNG bị ban và đang ở /banned thì redirect về trang trước đó (nếu có), không thì về trang chủ
    if (token && token.role !== 'admin' && token.isActive !== false && pathname === '/banned') {
        const from = request.nextUrl.searchParams.get('from');
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = from && from !== '/banned' ? from : '/';
        redirectUrl.searchParams.delete('from');
        return NextResponse.redirect(redirectUrl);
    }

    // Nếu user không phải admin mà vào /admin thì redirect về homepage
    if (pathname.startsWith('/admin')) {
        if (!token || token.role !== 'admin') {
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
