import mongoose from 'mongoose';
import User from '../../../../model/users';
import connectDB from '../../../../config/db';
import { generateAuthToken } from '../../../../lib/jwt';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        console.log('Login attempt for email:', email);

        if (!email || !password) {
            console.log('Missing email or password');
            return new Response(JSON.stringify({ error: 'Email and password are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Connect to database
        try {
            await connectDB();
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            return new Response(JSON.stringify({ error: 'Database connection failed' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        console.log('User found:', user ? 'yes' : 'no');
        
        if (!user) {
            console.log('User not found');
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Verify password
        try {
            console.log('Attempting to verify password');
            if (!user.comparePassword) {
                console.error('comparePassword method not found on user model');
                throw new Error('Invalid user model configuration');
            }

            const isValidPassword = await user.comparePassword(password);
            console.log('Password verification result:', isValidPassword);
            
            if (!isValidPassword) {
                console.log('Invalid password provided');
                return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        } catch (error) {
            console.error('Password verification error:', error);
            return new Response(JSON.stringify({ 
                error: 'Error verifying credentials',
                details: error.message
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Generate JWT token
        try {
            console.log('Generating authentication token');
            const token = generateAuthToken({
                id: user._id,
                email: user.email,
                role: user.role
            });

            // Set cookie options
            const cookieOptions = [
                `auth=${token}`,
                'Path=/',
                'HttpOnly',
                'Secure',
                'SameSite=Strict',
                'Max-Age=86400' // 24 hours
            ].join('; ');

            console.log('Login successful for user:', user.email);
            return new Response(JSON.stringify({
                user: {
                    email: user.email,
                    role: user.role
                }
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Set-Cookie': cookieOptions
                }
            });
        } catch (error) {
            console.error('Token generation error:', error);
            return new Response(JSON.stringify({ 
                error: 'Error generating authentication token',
                details: error.message
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
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