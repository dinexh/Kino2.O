import { verifyToken } from '../lib/jwt';

export async function withAuth(request) {
    try {
        // Get token from Authorization header or cookies
        const authHeader = request.headers.get('Authorization');
        const cookies = request.headers.get('cookie');
        
        let token;
        
        if (authHeader?.startsWith('Bearer ')) {
            token = authHeader.substring(7);
            console.log('Found token in Authorization header');
        } else if (cookies) {
            const authCookie = cookies.split(';').find(c => c.trim().startsWith('auth='));
            if (authCookie) {
                token = decodeURIComponent(authCookie.split('=')[1].trim());
                console.log('Found token in cookies');
            }
        }

        if (!token) {
            console.log('No token found in request');
            return null;
        }

        // Verify token
        const decoded = await verifyToken(token);
        if (!decoded) {
            console.log('Token verification failed');
            return null;
        }

        console.log('Token verified successfully for user:', decoded.email);
        return decoded;
    } catch (error) {
        console.error('Auth middleware error:', error);
        return null;
    }
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
            console.log('User role not authorized:', user.role, 'Required roles:', roles);
            return new Response(JSON.stringify({ error: 'Forbidden' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return user;
    };
} 