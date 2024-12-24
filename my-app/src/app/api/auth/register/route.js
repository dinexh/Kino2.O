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

export async function POST(request) {
    try {
        const { email, password, role } = await request.json();

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

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return new Response(JSON.stringify({ error: 'Email already registered' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Create new user
        const user = new User({
            email: email.toLowerCase(),
            password,
            role: role || 'user' // Default to 'user' if no role specified
        });

        await user.save();

        // Generate JWT token
        const token = generateAuthToken({
            id: user._id,
            email: user.email,
            role: user.role
        });

        return new Response(JSON.stringify({
            token,
            user: {
                email: user.email,
                role: user.role
            }
        }), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
                'Set-Cookie': `auth=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        return new Response(JSON.stringify({ error: 'Registration failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
} 