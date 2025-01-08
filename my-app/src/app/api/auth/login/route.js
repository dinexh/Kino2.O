import mongoose from 'mongoose';
import User from '../../../../model/users';
import connectDB from '../../../../config/db';
import { generateAccessToken, generateRefreshToken } from '../../../../lib/jwt';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        console.log('Login attempt started');
        
        // Parse request body
        let email, password;
        try {
            const body = await request.json();
            email = body.email;
            password = body.password;
        } catch (parseError) {
            console.error('Request parsing error:', parseError);
            return new Response(JSON.stringify({ 
                error: 'Invalid request format',
                details: parseError.message
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!email || !password) {
            console.log('Missing credentials');
            return new Response(JSON.stringify({ error: 'Email and password are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Database connection
        try {
            console.log('Attempting database connection');
            await connectDB();
            console.log('Database connection successful');
        } catch (dbError) {
            console.error('Database connection error:', dbError);
            return new Response(JSON.stringify({ 
                error: 'Database connection failed',
                details: dbError.message
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Find user
        let user;
        try {
            console.log('Finding user:', email.toLowerCase());
            user = await User.findOne({ email: email.toLowerCase() });
            console.log('User found:', !!user);
        } catch (userError) {
            console.error('User lookup error:', userError);
            return new Response(JSON.stringify({ 
                error: 'User lookup failed',
                details: userError.message
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!user) {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Verify password
        try {
            console.log('Verifying password');
            const isValidPassword = await user.comparePassword(password);
            console.log('Password valid:', isValidPassword);
            
            if (!isValidPassword) {
                return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        } catch (passwordError) {
            console.error('Password verification error:', passwordError);
            return new Response(JSON.stringify({ 
                error: 'Password verification failed',
                details: passwordError.message
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Generate tokens
        let accessToken, refreshToken;
        try {
            console.log('Generating tokens');
            accessToken = generateAccessToken({
                id: user._id.toString(),
                email: user.email,
                role: user.role
            });

            refreshToken = generateRefreshToken({
                id: user._id.toString(),
                email: user.email,
                role: user.role
            });
            console.log('Tokens generated successfully');
        } catch (tokenError) {
            console.error('Token generation error:', tokenError);
            return new Response(JSON.stringify({ 
                error: 'Token generation failed',
                details: tokenError.message
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Set cookies
        try {
            console.log('Setting cookies');
            const cookieStore = cookies();

            cookieStore.set('auth', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 600 // 10 minutes in seconds
            });

            cookieStore.set('refresh', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 1800 // 30 minutes in seconds
            });
            console.log('Cookies set successfully');
        } catch (cookieError) {
            console.error('Cookie setting error:', cookieError);
            return new Response(JSON.stringify({ 
                error: 'Cookie setting failed',
                details: cookieError.message
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        console.log('Login successful');
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
        console.error('Unexpected login error:', error);
        return new Response(JSON.stringify({ 
            error: 'Authentication failed',
            type: error.name,
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
} 