"use server";

import { pool } from "../../../../config/db";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

async function isAuth(username: string, password: string) {
    try {
        console.log('Attempting authentication for username:', username);
        
        const query = `
            SELECT username, name, role, active, id
            FROM users 
            WHERE username = ? AND password = ? AND role = 'Admin'
            LIMIT 1
        `;
        
        console.log('Executing query:', query);
        console.log('Parameters:', [username, password]);

        const [rows] = await pool.query(query, [username, password]);
        
        console.log('Query result:', rows);

        const users = rows as any[];
        
        if (users.length === 0) {
            console.log('No user found');
            return null;
        }

        console.log('User found:', users[0]);
        return users[0];
    } catch (error) {
        console.error('Database query error:', error);
        console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
        throw error;
    }
}

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

            // Set cookies
            const cookieStore = await cookies();
            cookieStore.set("authenticated", "true", {
                sameSite: "lax",
                secure: false,
                httpOnly: false,
                expires: new Date(Date.now() + 15 * 60 * 1000),
            });

            cookieStore.set("role", "Admin", {
                sameSite: "lax",
                secure: false,
                httpOnly: false,
                expires: new Date(Date.now() + 15 * 60 * 1000),
            });

            return NextResponse.json({
                message: "Authenticated",
                user: {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    role: user.role,
                },
                redirectUrl: "/auth/dashboard"
            });

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