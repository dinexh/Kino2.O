import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define public paths
  const isPublicPath = path === '/auth/login';
  
  // Get token from cookies
  const token = request.cookies.get('token')?.value || '';

  console.log('Current path:', path);
  console.log('Token present:', !!token);

  // If trying to access login page with token, redirect to appropriate dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // If trying to access protected route without token, redirect to login
  if (!isPublicPath && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Update matcher to be more specific
export const config = {
  matcher: [
    '/auth/login',
    '/admin/:path*',
    '/adminstrative/:path*',
  ]
}