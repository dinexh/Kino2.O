import mongoose from 'mongoose';
import { withAuth } from '../../../middleware/auth';
import connectDB from '../../../config/db';

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

export async function GET(request) {
    try {
        const user = await withAuth(request);
        
        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
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

        // Get search query from URL
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';

        // Build search query
        let query = {};
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { phoneNumber: { $regex: search, $options: 'i' } },
                    { idNumber: { $regex: search, $options: 'i' } },
                    { selectedEvents: { $regex: search, $options: 'i' } },
                    { referralName: { $regex: search, $options: 'i' } }
                ]
            };
        }

        // Get registrations from database
        const Registration = mongoose.models.Registration || mongoose.model('Registration', new mongoose.Schema({
            name: String,
            email: String,
            phoneNumber: String,
            idNumber: String,
            paymentStatus: String,
            selectedEvents: [String],
            referralName: String,
            createdAt: { type: Date, default: Date.now }
        }));

        const registrations = await Registration.find(query)
            .select('name email phoneNumber idNumber paymentStatus selectedEvents referralName')
            .sort({ createdAt: -1 })
            .limit(50);

        return new Response(JSON.stringify({ registrations }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error in verify API:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
} 