import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import mysql from 'mysql2/promise';

export async function GET() {
    try {
        const headersList = await headers();
        const authHeader = headersList.get('Authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized - No valid authorization header' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];
        
        try {
            // Decode the base64 token to get the user ID
            const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
            const userId = parseInt(decodedToken); // Assuming the token is just the user ID

            // Connect to database
            const connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });

            // Get the specific user by ID
            const [users] = await connection.execute(
                'SELECT id, username, role FROM users WHERE id = ? AND active = 1',
                [userId]
            );
            
            await connection.end();

            const user = (users as any[])[0];

            if (!user) {
                return NextResponse.json(
                    { error: 'User not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                userId: user.id,
                name: user.username,
                role: user.role
            });

        } catch (dbError) {
            console.error('Database Error:', dbError);
            return NextResponse.json(
                { error: 'Database error', details: dbError.message },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('General Error:', error);
        return NextResponse.json(
            { error: 'Server error' },
            { status: 500 }
        );
    }
} 