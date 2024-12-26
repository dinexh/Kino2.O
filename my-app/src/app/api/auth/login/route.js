import mongoose from 'mongoose';
import User from '../../../../model/users';
import connectDB from '../../../../config/db';
import { generateAuthToken } from '../../../../lib/jwt';
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

        // Generate JWT token
        const token = generateAuthToken({
            id: user._id.toString(), // Convert ObjectId to string
            email: user.email,
            role: user.role
        });

        // Get the cookies instance
        const cookieStore = cookies();

        // Set the auth cookie
        cookieStore.set('auth', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 // 24 hours
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