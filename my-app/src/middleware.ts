import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '../src/lib/auth'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define protected routes
  const isAdminRoute = path.startsWith('/admin');
  const isUserRoute = path.startsWith('/user');
  
  // Get the token from the session
  const token = request.cookies.get('auth_token')?.value;
  
  if (!token) {
    if (isAdminRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (isUserRoute) {
      return NextResponse.redirect(new URL('/events/register', request.url));
    }
  }

  try {
    const decoded = await verifyToken(token);
    
    // Check admin routes access
    if (isAdminRoute && !['Admin', 'SuperAdmin'].includes(decoded.role)) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Check user routes access
    if (isUserRoute && decoded.role !== 'RegisteredUser') {
      return NextResponse.redirect(new URL('/events/register', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Invalid token
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*']
};