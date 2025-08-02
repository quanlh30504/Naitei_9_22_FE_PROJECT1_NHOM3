import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ 
      req: request, 
      secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET 
    });

    return NextResponse.json({
      success: true,
      token: token,
      hasToken: !!token,
      roles: token?.roles,
      environment: {
        AUTH_SECRET: !!process.env.AUTH_SECRET,
        NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}
