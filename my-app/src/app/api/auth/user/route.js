import mongoose from 'mongoose';
import { withAuth } from '../../../../middleware/auth';
import connectDB from '../../../../config/db';

export const dynamic = 'force-dynamic';

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
    try {
        // Ensure database connection
        if (!(await ensureConnection())) {
            return new Response(JSON.stringify({ error: 'Database connection failed' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const user = await withAuth(request);
        
        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get user from database
        const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
            email: String,
            password: String,
            role: String,
            createdAt: { type: Date, default: Date.now }
        }));

        const dbUser = await User.findOne({ email: user.email }).select('-password');

        if (!dbUser) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify(dbUser), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error getting user:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
} 