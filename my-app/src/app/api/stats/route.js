import mongoose from 'mongoose';
import { withRole } from '../../../middleware/auth';
import connectDB from '../../../config/db';
import Registration from '../../../model/registrations';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        // Verify superuser authorization
        const user = await withRole(['superuser'])(request);
        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Connect to database
        await connectDB();

        // Get current date and date 7 days ago
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        // Get daily registrations for the last 7 days
        const dailyRegistrations = await Registration.aggregate([
            {
                $match: {
                    registrationDate: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$registrationDate" }
                    },
                    total: { $sum: 1 },
                    verified: {
                        $sum: {
                            $cond: [{ $eq: ["$paymentStatus", "verified"] }, 1, 0]
                        }
                    }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Get event statistics
        const eventStats = await Registration.aggregate([
            {
                $unwind: "$selectedEvents"
            },
            {
                $group: {
                    _id: "$selectedEvents",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get gender distribution
        const genderStats = await Registration.aggregate([
            {
                $group: {
                    _id: "$gender",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get profession distribution
        const professionStats = await Registration.aggregate([
            {
                $group: {
                    _id: "$profession",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get payment method distribution
        const paymentMethodStats = await Registration.aggregate([
            {
                $group: {
                    _id: "$paymentMethod",
                    count: { $sum: 1 }
                }
            }
        ]);

        return new Response(JSON.stringify({
            dailyRegistrations,
            eventStats,
            genderStats,
            professionStats,
            paymentMethodStats
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
} 