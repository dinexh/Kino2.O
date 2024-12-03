import { NextResponse } from 'next/server';
import { pool } from '../../../config/db';
import { PoolConnection } from 'mysql2/promise';

export async function POST(request: Request) {
    let connection: PoolConnection;
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
        
        connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // Create user entry
            const [userResult] = await connection.execute(
                `INSERT INTO users (username, email, password, role) 
                VALUES (?, ?, ?, ?)`,
                [
                    data.name,
                    data.email,
                    'defaultpassword123',
                    'User'
                ]
            );

            // Create college_id entry with the provided link
            const [collegeIdResult] = await connection.execute(
                `INSERT INTO college_ids (id_number, id_card_link) 
                VALUES (?, ?)`,
                [data.idNumber, data.idCardUploadLink]
            );

            // Create registration entry with full phone number
            const fullPhoneNumber = `${data.countryCode}${data.phoneNumber}`;
            const [regResult] = await connection.execute(
                `INSERT INTO registrations 
                (id_number, username, email, phone, college, gender, registration_status, selected_events, referral_name) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    data.idNumber,
                    data.name,
                    data.email,
                    fullPhoneNumber,
                    data.college,
                    data.gender.charAt(0).toUpperCase() + data.gender.slice(1),
                    'Pending',
                    JSON.stringify(data.selectedEvents),
                    data.referralName || null
                ]
            );
            
            await connection.commit();
            
            return NextResponse.json({
                success: true,
                message: 'Registration successful.',
                data: {
                    registration: regResult
                }
            });
            
        } catch (error) {
            await connection.rollback();
            console.error('Database operation error:', error);
            
            if (error.code === 'ER_DUP_ENTRY') {
                const errorMessage = error.message.includes('id_number') 
                    ? 'This ID number is already registered'
                    : error.message.includes('email')
                    ? 'This email is already registered'
                    : error.message.includes('username')
                    ? 'This username is already taken'
                    : 'This record already exists';
                
                return NextResponse.json({ error: errorMessage }, { status: 400 });
            }
            
            return NextResponse.json(
                { error: 'Registration failed', details: error.message },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Registration failed', details: error.message },
            { status: 500 }
        );
    } finally {
        if (connection) {
            await connection.release();
        }
    }
} 