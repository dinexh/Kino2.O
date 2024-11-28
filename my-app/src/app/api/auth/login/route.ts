"use server";

import { pool } from "../../../../config/db";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('👉 Login attempt for:', body.username);

        const { username, password } = body;

        try {
            const [rows] = await pool.query(
                'SELECT * FROM users WHERE username = ? AND password = ?',
                [username, password]
            );
            console.log('Query result:', rows);

            const users = rows as any[];
            
            if (users.length === 0) {
                return NextResponse.json(
                    { message: "Invalid credentials" },
                    { status: 401 }
                );
            }

            const user = users[0];
            console.log('User found:', { ...user, password: '[REDACTED]' });

            // Generate a real token (you should implement proper token generation)
            const token = Buffer.from(Date.now().toString()).toString('base64');

            const response = NextResponse.json({
                message: "Authenticated",
                user: {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    role: user.role,
                },
                token: token
            });

            // Set the authentication token
            response.cookies.set({
                name: 'token',
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
            });

            return response;

        } catch (dbError: any) {
            console.error('Database error:', {
                message: dbError.message,
                code: dbError.code,
                errno: dbError.errno,
                sqlMessage: dbError.sqlMessage,
                sqlState: dbError.sqlState
            });
            return NextResponse.json(
                { 
                    message: "Database error", 
                    details: dbError.message 
                },
                { status: 500 }
            );
        }

    } catch (error: any) {
        console.error('Server error:', error);
        return NextResponse.json(
            { message: "Server error", details: error.message },
            { status: 500 }
        );
    }
}