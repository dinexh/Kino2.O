import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check for authentication cookie
  const authToken = request.cookies.get('auth-token')
  
  // Protected routes that require authentication
  const protectedPaths = ['/admin/dashboard', '/administrative/dashboard']
  
  if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    if (!authToken) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/administrative/:path*']
}