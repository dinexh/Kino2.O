import { NextResponse } from 'next/server';
import User from '@/model/users';
import connectDB from '@/config/db';
import { verifyAuthToken } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const { token, password } = await request.json();
        console.log('Processing password reset request');

        if (!token || !password) {
            return NextResponse.json({ 
                error: 'Token and password are required' 
            }, { status: 400 });
        }

        const decoded = await verifyAuthToken(token);
        console.log('Token verification result:', decoded);

        if (!decoded || decoded.purpose !== 'password_reset') {
            return NextResponse.json({ 
                error: 'Invalid or expired token' 
            }, { status: 401 });
        }

        await connectDB();
        console.log('Looking for user:', decoded.email);

        const user = await User.findById(decoded.id);
        if (!user) {
            return NextResponse.json({ 
                error: 'User not found' 
            }, { status: 404 });
        }

        // Update password
        user.password = password;
        await user.save();
        console.log('Password updated successfully');

        return NextResponse.json({ 
            message: 'Password reset successful' 
        });

    } catch (error) {
        console.error('Password reset error:', error);
        return NextResponse.json({ 
            error: 'Failed to reset password' 
        }, { status: 500 });
    }
} 