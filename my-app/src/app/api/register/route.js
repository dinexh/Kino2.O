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

export async function POST(request) {
    try {
        // Parse request body first
        let data;
        try {
            data = await request.json();
        } catch (error) {
            return createResponse({ error: "Invalid request body" }, 400);
        }

        // Ensure database connection
        if (!(await ensureConnection())) {
            return createResponse({ 
                error: "Database connection failed" 
            }, 500);
        }

        // Validate required fields
        const requiredFields = ['name', 'email', 'phoneNumber', 'profession', 'gender'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            return createResponse({ 
                error: `Missing required fields: ${missingFields.join(', ')}` 
            }, 400);
        }

        // Clean and normalize data
        const cleanData = {
            ...data,
            email: data.email.toLowerCase().trim(),
            phoneNumber: data.phoneNumber.trim(),
            name: data.name.trim()
        };

        // Check for duplicate phone number
        const existingPhone = await Registration.findOne({ 
            phoneNumber: cleanData.phoneNumber 
        }).lean();

        if (existingPhone) {
            return createResponse({ 
                error: "Phone number already registered" 
            }, 400);
        }

        // Check for duplicate email
        const existingEmail = await Registration.findOne({ 
            email: cleanData.email
        }).lean();
        
        if (existingEmail) {
            return createResponse({ 
                error: "Email already registered" 
            }, 400);
        }

        return createResponse({
            message: "Validation successful",
            status: "ok"
        });

    } catch (error) {
        console.error('Registration validation error:', error);
        return createResponse({ 
            error: "Validation failed. Please try again." 
        }, 500);
    }
}

export async function GET(request) {
    try {
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
