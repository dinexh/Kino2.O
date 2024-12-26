import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = cookies();
        cookieStore.delete('auth');

        return new Response(JSON.stringify({ 
            message: 'Logged out successfully' 
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
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