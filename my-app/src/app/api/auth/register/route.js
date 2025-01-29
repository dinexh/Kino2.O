import { NextResponse } from 'next/server';
import User from '../../../../model/users';
import connectDB from '../../../../config/db';
import { generateAccessToken } from '../../../../lib/jwt';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        console.log('Received registration request for:', email);

        if (!email || !password) {
            return NextResponse.json({ 
                error: 'Email and password are required' 
            }, { status: 400 });
        }

        await connectDB();
        console.log('Looking for existing user with email:', email.toLowerCase());
        
        // Check if user already exists
        const existingUser = await User.findOne({ 
            email: { $regex: new RegExp('^' + email + '$', 'i') }
        });

        if (existingUser) {
            console.log('User already exists with email:', email.toLowerCase());
            return NextResponse.json({ 
                error: 'Email already registered' 
            }, { status: 400 });
        }

        // Create new user
        const user = new User({
            email: email.toLowerCase(),
            password,
            role: 'user'
        });

        await user.save();
        console.log('New user created:', user.email);

        // Generate JWT token
        const token = generateAccessToken({
            id: user._id.toString(),
            email: user.email,
            role: user.role
        });

        return NextResponse.json({
            message: 'Registration successful',
            user: {
                email: user.email,
                role: user.role
            }
        }, {
            status: 201,
            headers: {
                'Set-Cookie': `auth=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=600`
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ 
            error: 'Registration failed' 
        }, { status: 500 });
    }
} 