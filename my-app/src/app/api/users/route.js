import { NextResponse } from 'next/server';
import connectDB  from '../../../config/db';
import User from '../../../model/users';
import { withAuth } from '../../../middleware/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        // Verify superuser authorization
        const user = await withAuth(request);
        if (!user || user.role !== 'superuser') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Connect to database
        await connectDB();

        // Get request body
        const { email, password, role } = await request.json();

        // Validate input
        if (!email || !password || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Create new user with plain text password
        const newUser = new User({
            email,
            password,
            role
        });

        await newUser.save();

        return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 