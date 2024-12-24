import { verifyToken } from '../lib/jwt';

export async function withAuth(request) {
    // Get token from Authorization header or cookies
    const authHeader = request.headers.get('Authorization');
    const cookies = request.headers.get('cookie');
    
    let token;
    
    if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    } else if (cookies) {
        const authCookie = cookies.split(';').find(c => c.trim().startsWith('auth='));
        if (authCookie) {
            token = authCookie.split('=')[1];
        }
    }

    if (!token) {
        return null;
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
        return null;
    }

    return decoded;
}

export function withRole(roles) {
    return async (request) => {
        const user = await withAuth(request);
        
        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!roles.includes(user.role)) {
            return new Response(JSON.stringify({ error: 'Forbidden' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return user;
    };
} 