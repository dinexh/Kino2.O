import mongoose from 'mongoose';
import connectDB from '../../../config/db';
import Registration from '../../../model/registrations';
import { NextResponse } from 'next/server';
import { withAuth } from '../../../middleware/auth';

// Helper function to ensure response is properly formatted
const createResponse = (data, status = 200) => {
    return NextResponse.json(data, { status });
};

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
    return createResponse({ 
        error: "Registrations are closed. Thank you for your interest." 
    }, 403);
}

export async function GET(request) {
    try {
        // Check authentication for GET requests
        const user = await withAuth(request);
        if (!user || !['admin', 'superuser'].includes(user.role)) {
            return createResponse({ error: "Unauthorized access" }, 401);
        }

        if (!(await ensureConnection())) {
            return createResponse({ 
                error: "Database connection failed" 
            }, 500);
        }

        const registrations = await Registration.find({})
            .select('-__v')
            .lean();
        
        return createResponse(registrations);
    } catch (error) {
        console.error('Error fetching registrations:', error);
        return createResponse({ 
            error: "Failed to fetch registrations" 
        }, 500);
    }
}
