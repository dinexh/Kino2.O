import { verifyAuthToken } from '../lib/jwt';

export async function withAuth(request) {
    try {
        // Get token from cookies
        const cookies = request.cookies;
        const token = cookies.get('auth')?.value;

        if (!token) {
            console.log('No token found in request');
            return null;
        }

        // Verify token
        const decoded = await verifyAuthToken(token);
        if (!decoded) {
            console.log('Invalid or expired token');
            return null;
        }

        return decoded;
    } catch (error) {
        console.error('Authentication error:', error);
        return null;
    }
}

export async function isAuthenticated(request) {
    const user = await withAuth(request);
    return !!user;
}

export async function hasRole(request, allowedRoles) {
    const user = await withAuth(request);
    if (!user) return false;
    
    if (typeof allowedRoles === 'string') {
        return user.role === allowedRoles;
    }
    
    return allowedRoles.includes(user.role);
}

export function withRole(allowedRoles) {
    return async (request) => {
        const user = await withAuth(request);
        if (!user) {
            return null;
        }

        if (typeof allowedRoles === 'string') {
            return user.role === allowedRoles ? user : null;
        }

        return allowedRoles.includes(user.role) ? user : null;
    };
} 