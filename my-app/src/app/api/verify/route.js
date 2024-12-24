import mongoose from 'mongoose';
import connectDB from '../../../config/db';
import Registration from '../../../model/registrations';

// Helper function to ensure response is properly formatted
const createResponse = (data, status = 200) => {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
        },
    });
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

export async function GET(request) {
    console.log('GET verify data called');
    try {
        // Ensure database connection
        if (!(await ensureConnection())) {
            return createResponse({ 
                error: "Database connection failed" 
            }, 500);
        }

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');

        // Build query
        let query = {};
        
        // Add search filter if provided
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { idNumber: { $regex: search, $options: 'i' } },
                { phoneNumber: { $regex: search, $options: 'i' } }
            ];
        }

        // Fetch registrations
        const registrations = await Registration.find(query)
            .sort({ registrationDate: -1 })
            .lean();

        return createResponse({
            registrations: registrations.map(reg => ({
                ...reg,
                registrationDate: reg.registrationDate?.toISOString(),
                paymentDate: reg.paymentDate?.toISOString()
            }))
        });

    } catch (error) {
        console.error('Error fetching verify data:', error);
        return createResponse({ 
            error: "Failed to fetch verify data",
            details: error.message
        }, 500);
    }
}

export async function PATCH(request) {
    console.log('PATCH verify status called');
    try {
        // Ensure database connection
        if (!(await ensureConnection())) {
            return createResponse({ 
                error: "Database connection failed" 
            }, 500);
        }

        const data = await request.json();
        const { registrationId } = data;

        if (!registrationId) {
            return createResponse({ 
                error: "Registration ID is required" 
            }, 400);
        }

        const registration = await Registration.findByIdAndUpdate(
            registrationId,
            { $set: { verified: !data.verified } },
            { new: true }
        ).lean();

        if (!registration) {
            return createResponse({ 
                error: "Registration not found" 
            }, 404);
        }

        return createResponse({
            message: "Verification status updated successfully",
            registration: {
                ...registration,
                registrationDate: registration.registrationDate?.toISOString(),
                paymentDate: registration.paymentDate?.toISOString()
            }
        });

    } catch (error) {
        console.error('Error updating verification status:', error);
        return createResponse({ 
            error: "Failed to update verification status",
            details: error.message
        }, 500);
    }
} 