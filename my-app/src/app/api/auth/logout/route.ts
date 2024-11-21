import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const cookieStore = cookies()
    
    // Delete all possible auth-related cookies
    cookieStore.delete('token')
    cookieStore.delete('user')
    cookieStore.delete('session')

    // Set headers to clear cookies on client side as well
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    )

    // Explicitly set cookie removal in response headers
    response.cookies.delete('token')
    response.cookies.delete('user')
    response.cookies.delete('session')

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    )
  }
}
