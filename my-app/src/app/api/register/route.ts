import { NextResponse } from 'next/server';
import { pool } from '../../../config/db';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        console.log('Received registration data:', data);

        // Validate required fields
        const requiredFields = ['name', 'email', 'idNumber', 'phoneNumber', 'college', 'gender', 'selectedEvents', 'idCardUploadLink'];
        const missingFields = requiredFields.filter(field => !data[field]);

        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `Missing required fields: ${missingFields.join(', ')}` },
                { status: 400 }
            );
        }

        if (!pool) {
            console.error('Database connection failed');
            return NextResponse.json(
                { error: 'Database connection failed' },
                { status: 500 }
            );
        }

        try {
            await pool.query('START TRANSACTION');
            
            // Create user entry
            const [userResult] = await pool.execute(
                `INSERT INTO users (username, email, password, role) 
                VALUES (?, ?, ?, ?)`,
                [
                    data.name,
                    data.email,
                    'defaultpassword123',
                    'RegisteredUser'
                ]
            );

            // Create registration entry with full phone number
            const fullPhoneNumber = `${data.countryCode}${data.phoneNumber}`;
            const [regResult] = await pool.execute(
                `INSERT INTO event_registrations 
                (name, email, id_number, phone_number, country_code, college, gender, referral_name, id_card_upload_link, registration_status, payment_status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    data.name,
                    data.email,
                    data.idNumber,
                    data.phoneNumber,
                    data.countryCode,
                    data.college,
                    data.gender,
                    data.referralName || null,
                    data.idCardUploadLink,
                    'pending',
                    'pending'
                ]
            );

            await pool.query('COMMIT');

            return NextResponse.json({
                success: true,
                message: 'Registration successful.',
                data: {
                    registration: regResult
                }
            });

        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('Database operation error:', error);

            let errorMessage = 'Registration failed';
            if (error.code === 'ER_DUP_ENTRY') {
                errorMessage = error.message.includes('id_number')
                    ? 'This ID number is already registered'
                    : error.message.includes('email')
                    ? 'This email is already registered'
                    : error.message.includes('username')
                    ? 'This username is already taken'
                    : errorMessage;
            }

            return NextResponse.json({ error: errorMessage }, { status: 400 });
        }
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Registration failed', details: error.message },
            { status: 500 }
        );
    }
}
