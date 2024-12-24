import mongoose from 'mongoose';
import { withAuth } from '../../../../middleware/auth';
import User from '../../../../model/users';
import connectDB from '../../../../config/db';

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

export async function GET(request) {
    const decoded = await withAuth(request);
    
    if (!decoded) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // Ensure database connection
        if (!(await ensureConnection())) {
            return new Response(JSON.stringify({ error: 'Database connection failed' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get user from database
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            email: user.email,
            role: user.role
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error getting user:', error);
        return new Response(JSON.stringify({ error: 'Failed to get user' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
} 