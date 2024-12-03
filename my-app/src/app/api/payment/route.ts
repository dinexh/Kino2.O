import { NextResponse } from 'next/server';
import { query } from '@/config/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            idNumber,
            email,
            paymentId,
            registrationData
        } = body;

        // Validate the registration data
        const registration = await query(
            'SELECT id FROM event_registrations WHERE id_number = ? AND email = ?',
            [idNumber, email]
        );

        if (!registration.length) {
            return NextResponse.json(
                { success: false, error: 'Registration not found' },
                { status: 404 }
            );
        }

        const registrationId = registration[0].id;

        // Start transaction
        await query('START TRANSACTION');

        // Create payment record
        await query(
            `INSERT INTO payments 
            (registration_id, student_id, email, payment_id, amount) 
            VALUES (?, ?, ?, ?, ?)`,
            [registrationId, idNumber, email, paymentId, 250.00]
        );

        // Update registration payment status
        await query(
            `UPDATE event_registrations 
            SET payment_status = 'pending' 
            WHERE id = ?`,
            [registrationId]
        );

        // Commit transaction
        await query('COMMIT');

        return NextResponse.json({
            success: true,
            message: 'Payment details submitted successfully'
        });

    } catch (error) {
        // Rollback in case of error
        await query('ROLLBACK');
        
        console.error('Payment submission error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to submit payment details' },
            { status: 500 }
        );
    }
}

// API endpoint for admins to verify payments
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { paymentId, adminId, status } = body;

        await query(
            `UPDATE payments 
            SET payment_status = ?,
                verified_by = ?,
                verification_date = CURRENT_TIMESTAMP
            WHERE payment_id = ?`,
            [status, adminId, paymentId]
        );

        // If payment is verified, update registration status
        if (status === 'completed') {
            await query(
                `UPDATE event_registrations er
                JOIN payments p ON er.id = p.registration_id
                SET er.payment_status = 'completed'
                WHERE p.payment_id = ?`,
                [paymentId]
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Payment status updated successfully'
        });

    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to verify payment' },
            { status: 500 }
        );
    }
} 