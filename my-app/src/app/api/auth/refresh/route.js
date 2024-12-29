import { cookies } from 'next/headers';
import { refreshAccessToken } from '../../../../lib/jwt';

export async function POST() {
    try {
        const cookieStore = cookies();
        const refreshToken = cookieStore.get('refresh')?.value;

        if (!refreshToken) {
            return new Response(JSON.stringify({ 
                error: 'No refresh token found' 
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const result = await refreshAccessToken(refreshToken);
        if (!result) {
            // Clear both tokens if refresh fails
            cookieStore.delete('auth');
            cookieStore.delete('refresh');
            return new Response(JSON.stringify({ 
                error: 'Invalid or expired refresh token' 
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Set new access token
        cookieStore.set('auth', result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 10 // 10 minutes
        });

        return new Response(JSON.stringify({ 
            message: 'Access token refreshed successfully' 
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Token refresh error:', error);
        return new Response(JSON.stringify({ 
            error: 'Failed to refresh token',
            details: error.message 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
} 