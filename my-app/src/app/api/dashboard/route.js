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
            // Fetch all registrations for analytics
            const allRegistrations = await Registration.find({}).lean();

            // Calculate gender distribution
            const genderDistribution = allRegistrations.reduce((acc, reg) => {
                acc[reg.gender] = (acc[reg.gender] || 0) + 1;
                return acc;
            }, { male: 0, female: 0 });

            // Calculate daily registrations
            const dailyRegistrations = allRegistrations.reduce((acc, reg) => {
                const date = new Date(reg.registrationDate).toLocaleDateString();
                acc[date] = (acc[date] || 0) + 1;
                return acc;
            }, {});

            // Calculate hourly distribution
            const hourlyDistribution = Array(24).fill(0);
            allRegistrations.forEach(reg => {
                const hour = new Date(reg.registrationDate).getHours();
                hourlyDistribution[hour]++;
            });

            // Calculate event popularity
            const eventPopularity = allRegistrations.reduce((acc, reg) => {
                reg.selectedEvents.forEach(event => {
                    acc[event] = (acc[event] || 0) + 1;
                });
                return acc;
            }, {});

            // Format daily registrations for chart
            const dailyRegArray = Object.entries(dailyRegistrations)
                .map(([date, count]) => ({ date, count }))
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            return createResponse({
                analytics: {
                    genderDistribution,
                    dailyRegistrations: dailyRegArray,
                    hourlyDistribution,
                    eventPopularity
                }
            });
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
    console.log('PATCH registration status called');
    try {
        // Ensure database connection
        if (!(await ensureConnection())) {
            return createResponse({ 
                error: "Database connection failed" 
            }, 500);
        }

        const data = await request.json();
        console.log('Received update data:', data);
        
        const { registrationId, status, action } = data;

        if (!registrationId || !status) {
            return createResponse({ 
                error: "Registration ID and status are required" 
            }, 400);
        }

        if (action !== 'updateStatus') {
            return createResponse({ 
                error: "Invalid action" 
            }, 400);
        }

        const validStatuses = ['pending_verification', 'verified', 'rejected'];
        if (!validStatuses.includes(status)) {
            return createResponse({ 
                error: `Invalid status value. Must be one of: ${validStatuses.join(', ')}` 
            }, 400);
        }

        const registration = await Registration.findByIdAndUpdate(
            registrationId,
            { paymentStatus: status },
            { new: true }
        ).lean();

        if (!registration) {
            return createResponse({ 
                error: "Registration not found" 
            }, 404);
        }

        return createResponse({
            message: "Status updated successfully",
            registration: {
                ...registration,
                registrationDate: registration.registrationDate?.toISOString(),
                paymentDate: registration.paymentDate?.toISOString()
            }
        });

    } catch (error) {
        console.error('Error updating registration status:', error);
        return createResponse({ 
            error: "Failed to update status",
            details: error.message
        }, 500);
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