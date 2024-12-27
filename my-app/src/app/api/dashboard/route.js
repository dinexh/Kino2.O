import mongoose from 'mongoose';
import connectDB from '../../../config/db';
import Registration from '../../../model/registrations';
import { NextResponse } from 'next/server';
import { withAuth } from '../../../middleware/auth';
import { sendEmail } from '../../../utils/emailService';
import { getVerificationEmailTemplate } from '../../../utils/emailTemplates';

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

export const dynamic = 'force-dynamic';

export async function GET(request) {
    console.log('GET dashboard data called');
    try {
        // Ensure database connection
        if (!(await ensureConnection())) {
            return createResponse({ 
                error: "Database connection failed" 
            }, 500);
        }

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const status = searchParams.get('status');
        const search = searchParams.get('search');
        const getReferrals = searchParams.get('getReferrals') === 'true';
        const getAnalytics = searchParams.get('analytics') === 'true';

        // Build query
        let query = {};
        
        // Add status filter if provided
        if (status && status !== 'all') {
            query.paymentStatus = status;
        }

        // Add search filter if provided
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phoneNumber: { $regex: search, $options: 'i' } },
                { college: { $regex: search, $options: 'i' } }
            ];
        }

        if (getAnalytics) {
            try {
                // Fetch all registrations for analytics
                const allRegistrations = await Registration.find({})
                    .select('gender registrationDate selectedEvents')
                    .lean();

                if (!allRegistrations) {
                    return createResponse({ 
                        error: "No registration data found" 
                    }, 404);
                }

                // Calculate gender distribution with safe defaults
                const genderDistribution = allRegistrations.reduce((acc, reg) => {
                    const gender = (reg.gender || '').toLowerCase();
                    if (gender === 'male' || gender === 'female') {
                        acc[gender] = (acc[gender] || 0) + 1;
                    }
                    return acc;
                }, { male: 0, female: 0 });

                // Calculate daily registrations with validation
                const dailyRegistrations = allRegistrations.reduce((acc, reg) => {
                    if (reg.registrationDate) {
                        const date = new Date(reg.registrationDate).toLocaleDateString();
                        acc[date] = (acc[date] || 0) + 1;
                    }
                    return acc;
                }, {});

                // Calculate hourly distribution with validation
                const hourlyDistribution = Array(24).fill(0);
                allRegistrations.forEach(reg => {
                    if (reg.registrationDate) {
                        const hour = new Date(reg.registrationDate).getHours();
                        if (hour >= 0 && hour < 24) {
                            hourlyDistribution[hour]++;
                        }
                    }
                });

                // Calculate event popularity with validation
                const eventPopularity = allRegistrations.reduce((acc, reg) => {
                    if (Array.isArray(reg.selectedEvents)) {
                        reg.selectedEvents.forEach(event => {
                            if (event && typeof event === 'string') {
                                acc[event] = (acc[event] || 0) + 1;
                            }
                        });
                    }
                    return acc;
                }, {});

                // Format daily registrations for chart
                const dailyRegArray = Object.entries(dailyRegistrations)
                    .map(([date, count]) => ({ 
                        date, 
                        count 
                    }))
                    .sort((a, b) => new Date(a.date) - new Date(b.date));

                return createResponse({
                    analytics: {
                        genderDistribution,
                        dailyRegistrations: dailyRegArray,
                        hourlyDistribution,
                        eventPopularity
                    }
                });
            } catch (error) {
                console.error('Analytics calculation error:', error);
                return createResponse({ 
                    error: "Failed to calculate analytics",
                    details: error.message 
                }, 500);
            }
        }

        // Calculate stats
        const [
            totalRegistrations,
            pendingPayments,
            verifiedPayments,
            totalReferrals,
            registrations
        ] = await Promise.all([
            Registration.countDocuments({}),
            Registration.countDocuments({ paymentStatus: { $ne: 'verified' } }),
            Registration.countDocuments({ paymentStatus: 'verified' }),
            Registration.countDocuments({ referralName: { $exists: true, $ne: null } }),
            getReferrals 
                ? Registration.find({}).select('referralName').lean()
                : Registration.find(query)
                    .sort({ registrationDate: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .lean()
        ]);

        // Calculate total amount collected (₹350 per verified registration)
        const totalAmountCollected = verifiedPayments * 350;

        // Get total pages (not needed for referrals request)
        const totalPages = getReferrals ? 1 : Math.ceil(await Registration.countDocuments(query) / limit);

        return createResponse({
            stats: {
                totalRegistrations,
                pendingPayments,
                verifiedPayments,
                totalReferrals,
                totalAmountCollected
            },
            registrations: registrations.map(reg => ({
                ...reg,
                registrationDate: reg.registrationDate?.toISOString(),
                paymentDate: reg.paymentDate?.toISOString()
            })),
            pagination: {
                currentPage: page,
                totalPages,
                totalDocuments: totalRegistrations,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return createResponse({ 
            error: "Failed to fetch dashboard data",
            details: error.message
        }, 500);
    }
}

export async function PATCH(request) {
    try {
        const user = await withAuth(request);
        if (!user || user.role !== 'superuser') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const { registrationId, status, action } = data;

        if (!registrationId || !status || !action) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Ensure database connection
        if (!(await ensureConnection())) {
            return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
        }

        // Get Registration model
        const Registration = mongoose.models.Registration || mongoose.model('Registration', new mongoose.Schema({
            name: String,
            email: String,
            phoneNumber: String,
            profession: String,
            idType: String,
            idNumber: String,
            college: String,
            gender: String,
            referralName: String,
            selectedEvents: [String],
            registrationDate: Date,
            paymentStatus: String,
            transactionId: String,
            paymentDate: Date,
            paymentMethod: String,
            otherPaymentMethod: String
        }));

        // Update registration status
        const registration = await Registration.findByIdAndUpdate(
            registrationId,
            { paymentStatus: status },
            { new: true }
        );

        if (!registration) {
            return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
        }

        // Send verification email if status is changed to 'verified'
        if (status === 'verified') {
            try {
                const emailTemplate = getVerificationEmailTemplate(registration);
                await sendEmail({
                    to: registration.email,
                    subject: 'Registration Verified',
                    html: emailTemplate
                });
            } catch (error) {
                console.error('Error sending verification email:', error);
                // Don't return error response here, as the status update was successful
            }
        }

        return NextResponse.json({ 
            message: 'Status updated successfully',
            registration 
        });

    } catch (error) {
        console.error('Error updating status:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const user = await withAuth(request);
        if (!user || user.role !== 'superuser') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const { registrationId, action } = data;

        if (!registrationId || !action) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Ensure database connection
        if (!(await ensureConnection())) {
            return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
        }

        // Get registration details
        const registration = await Registration.findById(registrationId);

        if (!registration) {
            return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
        }

        if (action === 'sendEmail') {
            try {
                const emailTemplate = getVerificationEmailTemplate(registration);
                await sendEmail({
                    to: registration.email,
                    subject: 'Registration Verified',
                    html: emailTemplate
                });

                return NextResponse.json({ 
                    message: 'Email sent successfully'
                });
            } catch (error) {
                console.error('Error sending email:', error);
                return NextResponse.json({ 
                    error: 'Failed to send email',
                    details: error.message 
                }, { status: 500 });
            }
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Error in POST request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request) {
    console.log('DELETE registration called');
    try {
        // Ensure database connection
        if (!(await ensureConnection())) {
            return createResponse({ 
                error: "Database connection failed" 
            }, 500);
        }

        const { searchParams } = new URL(request.url);
        const registrationId = searchParams.get('id');

        if (!registrationId) {
            return createResponse({ 
                error: "Registration ID is required" 
            }, 400);
        }

        const registration = await Registration.findByIdAndDelete(registrationId);

        if (!registration) {
            return createResponse({ 
                error: "Registration not found" 
            }, 404);
        }

        return createResponse({
            message: "Registration deleted successfully",
            registrationId
        });

    } catch (error) {
        console.error('Error deleting registration:', error);
        return createResponse({ 
            error: "Failed to delete registration",
            details: error.message
        }, 500);
    }
} 