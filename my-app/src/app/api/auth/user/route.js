import { verifyAuthToken } from '../../../../lib/jwt';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('auth')?.value;

        if (!token) {
            return new Response(JSON.stringify({ 
                error: 'No authentication token found' 
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const decoded = await verifyAuthToken(token);
        
        if (!decoded) {
            // Clear invalid token
            cookieStore.delete('auth');
            return new Response(JSON.stringify({ 
                error: 'Invalid or expired token' 
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            user: {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Auth check error:', error);
        return new Response(JSON.stringify({ 
            error: 'Authentication failed',
            details: error.message 
        }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }
} 