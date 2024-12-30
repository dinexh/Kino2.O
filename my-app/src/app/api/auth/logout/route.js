import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = cookies();
        
        // Delete both auth and refresh tokens
        cookieStore.delete('auth');
        cookieStore.delete('refresh');

        // Set cookies with expired date to ensure they're removed
        return new Response(JSON.stringify({ 
            message: 'Logged out successfully' 
        }), {
            status: 200,
            headers: { 
                'Content-Type': 'application/json',
                'Set-Cookie': [
                    'auth=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
                    'refresh=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
                ]
            }
        });
    } catch (error) {
        console.error('Logout error:', error);
        return new Response(JSON.stringify({ 
            error: 'Logout failed',
            details: error.message 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
} 