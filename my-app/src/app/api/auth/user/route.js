import mongoose from 'mongoose';
import { withAuth } from '../../../../middleware/auth';
import connectDB from '../../../../config/db';
import User from '../../../../model/users';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    console.log('GET /api/auth/user called');
    try {
        // Connect to database first
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

        // Check authentication
        const authResult = await withAuth(request);
        console.log('Auth result:', authResult);
        
        if (!authResult) {
            console.log('Authentication failed - no valid token');
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get user from database
        const user = await User.findOne({ email: authResult.email }).select('-password');
        console.log('User found:', user ? 'yes' : 'no');

        if (!user) {
            console.log('User not found in database');
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        console.log('Successfully retrieved user data');
        return new Response(JSON.stringify({
            email: user.email,
            role: user.role,
            id: user._id
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error in /api/auth/user:', error);
        return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
} 