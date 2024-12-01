import { NextResponse } from 'next/server';
import { pool } from '../../../config/db';
import { PoolConnection } from 'mysql2/promise';

export async function POST(request: Request) {
    let connection: PoolConnection;
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
            
            // Create college_id entry with form link
            const formLink = `https://forms.office.com/r/xyz123?id=${data.idNumber}`; // Replace with your actual form link
            console.log('Generated form link:', formLink);

            // First create user entry (to avoid foreign key constraint issues)
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
            console.log('User created:', userResult);

            // Then create college_id entry
            const [collegeIdResult] = await connection.execute(
                `INSERT INTO college_ids 
                (id_number, original_filename, stored_filename, file_path, file_size, mime_type, form_link) 
                VALUES (?, '', '', '', 0, '', ?)`,
                [data.idNumber, formLink]
            );
            console.log('College ID entry created:', collegeIdResult);
            
            // Finally create registration entry
            const [regResult] = await connection.execute(
                `INSERT INTO registrations 
                (id_number, username, email, phone, college, gender, registration_status) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    data.idNumber,
                    data.name,
                    data.email,
                    data.phoneNumber,
                    data.college,
                    data.gender.charAt(0).toUpperCase() + data.gender.slice(1),
                    'Pending'
                ]
            );
            console.log('Registration created:', regResult);
            
            await connection.commit();
            console.log('Transaction committed successfully');
            
            const responseData = {
                success: true,
                message: 'Registration successful. Please upload your ID card using the provided link to complete registration.',
                data: {
                    registration: regResult,
                    idCardUploadLink: formLink
                }
            };
            console.log('Sending response:', responseData);
            
            return NextResponse.json(responseData);
            
        } catch (error) {
            console.error('Database operation error:', error);
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
            
            return NextResponse.json(
                { 
                    error: 'Registration failed',
                    details: error.message
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { 
                error: 'Registration failed', 
                details: error.message 
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