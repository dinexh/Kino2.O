import { NextResponse } from 'next/server';
import { pool } from '../../../config/db';

export async function POST(request: Request) {
    let connection;
    try {
        const data = await request.json();
        console.log('Received payment data:', data);
        
        if (!pool) {
            console.error('Database pool is not initialized');
            return NextResponse.json(
                { error: 'Database connection failed' },
                { status: 500 }
            );
        }
        
        connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // Insert payment record
            const [result] = await connection.execute(
                `INSERT INTO payments 
                (id_number, event_id, amount, payment_status, transaction_id) 
                VALUES (?, ?, ?, ?, ?)`,
                [
                    data.idNumber,
                    data.eventId,
                    data.amount,
                    'Pending',
                    data.paymentId
                ]
            );

            // Update event registration status
            const [updateResult] = await connection.execute(
                `UPDATE event_registrations 
                SET registration_status = 'Pending' 
                WHERE id_number = ? AND event_id = ?`,
                [data.idNumber, data.eventId]
            );

            await connection.commit();
            
            return NextResponse.json({ 
                success: true, 
                message: 'Payment recorded successfully',
                data: {
                    paymentId: result.insertId,
                    transactionId: data.paymentId
                }
            });
        } catch (error) {
            console.error('Database operation error:', error);
            await connection.rollback();
            throw error;
        }
    } catch (error) {
        console.error('Payment error:', error);
        return NextResponse.json(
            { error: 'Payment processing failed', details: error.message },
            { status: 500 }
        );
    } finally {
        if (connection) {
            await connection.release();
        }
    }
} 