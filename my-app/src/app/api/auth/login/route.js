import mongoose from 'mongoose';
import User from '../../../../model/users';
import connectDB from '../../../../config/db';
import { generateAccessToken, generateRefreshToken } from '../../../../lib/jwt';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return new Response(JSON.stringify({ error: 'Email and password are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await connectDB();
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user || !(await user.comparePassword(password))) {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Generate both tokens
        const accessToken = generateAccessToken({
            id: user._id.toString(),
            email: user.email,
            role: user.role
        });

        const refreshToken = generateRefreshToken({
            id: user._id.toString(),
            email: user.email,
            role: user.role
        });

        // Get the cookies instance
        const cookieStore = cookies();

        // Set the access token cookie
        cookieStore.set('auth', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 10 // 10 minutes
        });

        // Set the refresh token cookie
        cookieStore.set('refresh', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 30 // 30 minutes
        });

        return new Response(JSON.stringify({
            user: {
                id: user._id.toString(),
                email: user.email,
                role: user.role
            }
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return new Response(JSON.stringify({ 
            error: 'Authentication failed', 
            details: error.message 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
} 