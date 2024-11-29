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
                `INSERT INTO users (username, email, password, role) 
                VALUES (?, ?, ?, ?)`,
                [
                    data.username,
                    data.email,
                    data.password,
                    'Registered'
                ]
            );

            // Then store the college ID
            const [collegeIdResult] = await connection.execute(
                `INSERT INTO college_ids 
                (id_number, original_filename, stored_filename, file_path, file_size, mime_type) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    data.idNumber,
                    data.collegeId.originalFilename,
                    data.collegeId.storedFilename,
                    data.collegeId.filePath,
                    data.collegeId.size,
                    data.collegeId.type
                ]
            );
            
            // Finally create registration entry
            const [regResult] = await connection.execute(
                `INSERT INTO registrations 
                (id_number, username, email, phone, college, gender, registration_status) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    data.idNumber,
                    data.username,
                    data.email,
                    data.phoneNumber,
                    data.college,
                    data.gender,
                    'Pending'
                ]
            );

            await connection.commit();
            console.log('Registration successful');
            
            return NextResponse.json({ 
                success: true, 
                message: 'Registration successful',
                data: {
                    userId: userResult.insertId,
                    idNumber: data.idNumber
                }
            });
        } catch (error) {
            console.error('Database operation error:', error);
            await connection.rollback();
            
            if (error.code === 'ER_DUP_ENTRY') {
                let errorMessage = 'This record already exists';
                if (error.message.includes('username')) {
                    errorMessage = 'This username is already taken';
                } else if (error.message.includes('email')) {
                    errorMessage = 'This email is already registered';
                } else if (error.message.includes('id_number')) {
                    errorMessage = 'This ID number is already registered';
                } else if (error.message.includes('phone')) {
                    errorMessage = 'This phone number is already registered';
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