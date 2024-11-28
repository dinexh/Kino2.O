import { NextResponse } from 'next/server';
import { pool } from '../../../config/db';

export async function POST(request: Request) {
    let connection;
    try {
        const data = await request.json();
        console.log('Received registration data:', data);
        
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
            
            // First, create user entry
            const [userResult] = await connection.execute(
                `INSERT INTO users (username, password, role) 
                VALUES (?, ?, ?)`,
                [
                    data.name, // Using name as username
                    'defaultpassword123', // You might want to handle this differently
                    'User'
                ]
            );
            
            // Then create registration entry
            const [regResult] = await connection.execute(
                `INSERT INTO registrations 
                (id_number, username, email, phone, college, college_idcard, gender, referral, registration_status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    data.idNumber,
                    data.name, // username from users table
                    data.email,
                    data.phoneNumber,
                    data.college,
                    null, // college_idcard path - handle file upload separately
                    data.gender.charAt(0).toUpperCase() + data.gender.slice(1), // Capitalize first letter
                    data.referralName || null,
                    'Pending'
                ]
            );

            await connection.commit();
            console.log('Registration successful');
            
            return NextResponse.json({ 
                success: true, 
                message: 'Registration successful',
                data: regResult 
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
            
            if (error.code === 'ER_DUP_ENTRY') {
                let errorMessage = 'This record already exists';
                if (error.message.includes('username')) {
                    errorMessage = 'This username is already taken';
                } else if (error.message.includes('id_number')) {
                    errorMessage = 'This ID number is already registered';
                } else if (error.message.includes('email')) {
                    errorMessage = 'This email is already registered';
                }
                
                return NextResponse.json(
                    { error: errorMessage },
                    { status: 400 }
                );
            }
            
            throw error;
        }
    } catch (error) {
        console.error('Registration error:', error);
        console.error('Full error details:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        return NextResponse.json(
            { 
                error: 'Registration failed', 
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