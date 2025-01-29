import { NextResponse } from 'next/server';
import { verifyAuthToken } from '../../../../lib/jwt';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const { token } = await request.json();
        console.log('Verifying reset token');

        if (!token) {
            return NextResponse.json({ 
                error: 'Token is required' 
            }, { status: 400 });
        }

        const decoded = await verifyAuthToken(token);
        console.log('Token verification result:', decoded);

        if (!decoded || decoded.purpose !== 'password_reset') {
            return NextResponse.json({ 
                error: 'Invalid or expired token' 
            }, { status: 401 });
        }

        return NextResponse.json({ 
            valid: true,
            email: decoded.email 
        });

    } catch (error) {
        console.error('Token verification error:', error);
        return NextResponse.json({ 
            error: 'Invalid or expired token' 
        }, { status: 401 });
    }
} 