import mongoose from 'mongoose';
import User from '../../../../model/users';
import connectDB from '../../../../config/db';
import { generateAuthToken } from '../../../../lib/jwt';

// Helper function to safely connect to MongoDB
const ensureConnection = async () => {
    try {
        if (!mongoose.connections[0].readyState) {
            await connectDB();
        }
        return true;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        return false;
    }
};

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

        // Ensure database connection
        if (!(await ensureConnection())) {
            return new Response(JSON.stringify({ error: 'Database connection failed' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Verify password
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Generate JWT token
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
        console.error('Login error:', error);
        return new Response(JSON.stringify({ error: 'Authentication failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
} 