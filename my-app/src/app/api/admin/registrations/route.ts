import { NextResponse } from 'next/server';
import { query } from '@/config/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
    try {
        // Check admin authentication
        const session = await getServerSession(authOptions);
        if (!session || !['Admin', 'SuperAdmin'].includes(session.user.role)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch registrations with their events
        const registrations = await query(`
            SELECT 
                er.*,
                GROUP_CONCAT(re.event_name) as events,
                p.payment_status
            FROM event_registrations er
            LEFT JOIN registration_events re ON er.id = re.registration_id
            LEFT JOIN payments p ON er.id = p.registration_id
            GROUP BY er.id
            ORDER BY er.created_at DESC
        `);

        return NextResponse.json({
            success: true,
            data: registrations
        });

    } catch (error) {
        console.error('Error fetching registrations:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch registrations' },
            { status: 500 }
        );
    }
} 