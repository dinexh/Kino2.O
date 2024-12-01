import { NextResponse } from 'next/server';
import { pool } from '../../../config/db';
import { PoolConnection } from 'mysql2/promise';
export async function POST(request: Request) {
    let connection: PoolConnection;
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
        console.log('Database connection established');
        
        try {
            await connection.beginTransaction();
            console.log('Transaction started');
            
            // Insert payment record with event_id
            const [result] = await connection.execute(
                `INSERT INTO payments 
                (id_number, event_id, amount, payment_status, transaction_id) 
                VALUES (?, ?, ?, ?, ?)`,
                [
                    data.idNumber,
                    data.eventId,
                    250.00,
                    'Pending',
                    data.paymentId
                ]
            );
            console.log('Payment record inserted:', result);

            // Update registration status and create event registration
            const [eventRegResult] = await connection.execute(
                `INSERT INTO event_registrations 
                (id_number, event_id, registration_status) 
                VALUES (?, ?, ?)`,
                [data.idNumber, data.eventId, 'Pending']
            );
            
            // Update main registration status
            const [updateResult] = await connection.execute(
                `UPDATE registrations 
                SET registration_status = 'Confirmed' 
                WHERE id_number = ?`,
                [data.idNumber]
            );
            
            await connection.commit();
            console.log('Transaction committed');
            
            return NextResponse.json({ 
                success: true, 
                data: {
                    payment: result,
                    eventRegistration: eventRegResult
                }
            });
            
        } catch (error) {
            console.error('Database operation error:', error);
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                sqlState: error.sqlState,
                sqlMessage: error.sqlMessage
            });
            await connection.rollback();
            throw error;
        }
    } catch (error) {
        console.error('Payment error:', error);
        console.error('Full error details:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        return NextResponse.json(
            { 
                error: 'Payment verification failed',
                details: error.message,
                code: error.code
            },
            { status: 500 }
        );
    } finally {
        if (connection) {
            try {
                await connection.release();
                console.log('Connection released successfully');
            } catch (releaseError) {
                console.error('Error releasing connection:', releaseError);
            }
        }
    }
} 