import mongoose from 'mongoose';
import connectDB from '../../../config/db';
import Registration from '../../../model/registrations';
import { addRegistrationToFirebase } from '../../../lib/firebase';

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
    console.log('GET payment status called');
    try {
        // Ensure database connection
        if (!(await ensureConnection())) {
            return createResponse({ 
                error: "Database connection failed" 
            }, 500);
        }

        const { searchParams } = new URL(request.url);
        const transactionId = searchParams.get('transactionId');
        console.log('Checking transactionId:', transactionId);

        if (!transactionId) {
            return createResponse({ 
                error: "Transaction ID is required" 
            }, 400);
        }

        const registration = await Registration.findOne({ 
            transactionId: transactionId 
        }).lean();

        if (!registration) {
            return createResponse({ 
                error: "Transaction not found",
                exists: false
            }, 404);
        }

        return createResponse({
            exists: true,
            paymentStatus: registration.paymentStatus
        });

    } catch (error) {
        console.error('Error checking payment status:', error);
        return createResponse({ 
            error: "Failed to check payment status",
            details: error.message
        }, 500);
    }
}

export async function POST(request) {
    console.log('POST payment called');
    try {
        // Parse request body
        let data;
        try {
            data = await request.json();
            console.log('Received payment data:', data);
        } catch (error) {
            console.error('Error parsing request body:', error);
            return createResponse({ 
                error: "Invalid request body" 
            }, 400);
        }

        // Ensure database connection
        if (!(await ensureConnection())) {
            return createResponse({ 
                error: "Database connection failed" 
            }, 500);
        }

        // Validate required fields
        const requiredFields = [
            'name', 'email', 'phoneNumber', 'profession', 
            'selectedEvents', 'transactionId', 'paymentMethod'
        ];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            return createResponse({ 
                error: `Missing required fields: ${missingFields.join(', ')}` 
            }, 400);
        }

        // Check for duplicate transaction ID
        const existingTransaction = await Registration.findOne({ 
            transactionId: data.transactionId 
        }).lean();

        if (existingTransaction) {
            return createResponse({ 
                error: "Transaction ID already registered" 
            }, 400);
        }

        // Create new registration
        const registration = new Registration({
            name: data.name,
            email: data.email.toLowerCase(),
            phoneNumber: data.phoneNumber,
            profession: data.profession,
            idType: data.profession === 'working' ? data.idType : null,
            idNumber: data.idNumber || '',
            college: data.profession === 'student' ? data.college : null,
            gender: data.gender,
            referralName: data.referralName || null,
            selectedEvents: data.selectedEvents,
            registrationDate: new Date(),
            paymentStatus: 'pending_verification',
            transactionId: data.transactionId,
            paymentDate: new Date(),
            paymentMethod: data.paymentMethod,
            otherPaymentMethod: data.paymentMethod === 'Other' ? data.otherPaymentMethod : null
        });

        try {
            const savedRegistration = await registration.save();
            console.log('Registration saved:', savedRegistration._id);

            // Add to Firebase
            try {
                await addRegistrationToFirebase(savedRegistration);
            } catch (firebaseError) {
                console.error('Failed to sync with Firebase:', firebaseError);
                // Don't fail the request if Firebase sync fails
            }

            return createResponse({
                message: "Payment recorded successfully",
                registrationId: savedRegistration._id,
                status: "pending_verification"
            }, 201);

        } catch (error) {
            console.error('Error saving registration:', error);
            if (error.code === 11000) {
                return createResponse({ 
                    error: "Duplicate entry found" 
                }, 400);
            }
            throw error;
        }

    } catch (error) {
        console.error('Error processing payment:', error);
        return createResponse({ 
            error: "Payment processing failed",
            details: error.message
        }, 500);
    }
}
