import { NextResponse } from 'next/server';
import { getConnection } from '../../../config/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    let connection;
    try {
        const body = await request.json();
        const {
            name,
            email,
            idNumber,
            phoneNumber,
            countryCode,
            college,
            gender,
            referralName,
            selectedEvents,
            idCardUploadLink,
            password
        } = body;

        // Validate required fields
        if (!name || !email || !idNumber || !phoneNumber || !password) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Missing required fields' 
                },
                { status: 400 }
            );
        }

        // Validate selectedEvents is an array
        if (!Array.isArray(selectedEvents)) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Selected events must be an array' 
                },
                { status: 400 }
            );
        }

        // Get connection from pool to handle transaction
        connection = await getConnection();
        
        // Start transaction
        await connection.beginTransaction();

        // Create user account
        const hashedPassword = await bcrypt.hash(password, 10);
        const [userResult]: any = await connection.execute(
            `INSERT INTO users (username, email, password, role) 
             VALUES (?, ?, ?, 'RegisteredUser')`,
            [idNumber, email, hashedPassword]
        );

        if (!userResult?.insertId) {
            throw new Error('Failed to create user account');
        }

        const userId = userResult.insertId;

        // Create registration
        const [registrationResult]: any = await connection.execute(
            `INSERT INTO event_registrations 
            (user_id, name, email, id_number, phone_number, country_code, 
             college, gender, referral_name, id_card_upload_link) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                name || '',
                email,
                idNumber,
                phoneNumber,
                countryCode || '',
                college || '',
                gender || '',
                referralName || '',
                idCardUploadLink || ''
            ]
        );

        if (!registrationResult?.insertId) {
            throw new Error('Failed to create registration');
        }

        const registrationId = registrationResult.insertId;

        // Insert selected events
        for (const event of selectedEvents) {
            await connection.execute(
                'INSERT INTO registration_events (registration_id, event_name) VALUES (?, ?)',
                [registrationId, event]
            );
        }

        // Create initial payment record
        await connection.execute(
            'INSERT INTO payments (registration_id, amount, payment_status) VALUES (?, ?, ?)',
            [registrationId, '0.00', 'pending']  // Note: amount as string
        );

        // Commit transaction
        await connection.commit();

        return NextResponse.json({
            success: true,
            message: 'Registration successful',
            data: { registrationId, userId }
        });

    } catch (error) {
        // Rollback transaction on error
        if (connection) {
            await connection.rollback();
        }

        console.error('Registration error:', {
            message: error.message,
            code: error.code,
            stack: error.stack,
            body: request.body  // Log the request body for debugging
        });

        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'This email or ID number is already registered'
                },
                { status: 400 }
            );
        }

        if (error.code === 'ER_BAD_DB_ERROR') {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Database connection error. Please check your database configuration.'
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { 
                success: false, 
                error: 'Registration failed: ' + error.message
            },
            { status: 500 }
        );
    } finally {
        if (connection) {
            connection.release();
        }
    }
} 