import { verifyToken } from '../lib/jwt';
import { cookies } from 'next/headers';

export async function withAuth(request) {
    try {
        // Get the token from cookies
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return { success: false, error: 'No token found' };
        }

        // Verify the token
        const decoded = await verifyToken(token);
        if (!decoded) {
            return { success: false, error: 'Invalid token' };
        }

        // Return success with user data
        return {
            success: true,
            user: {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role
            }
        };
    } catch (error) {
        console.error('Auth middleware error:', error);
        return { success: false, error: 'Authentication failed' };
    }
} 