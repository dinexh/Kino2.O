import { NextResponse } from 'next/server';
import User from '../../../../model/users';
import connectDB from '../../../../config/db';
import { generateAccessToken } from '../../../../lib/jwt';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

export async function POST(request) {
    try {
        const { email } = await request.json();
        console.log('Received email request for:', email);

        if (!email) {
            return NextResponse.json({ 
                error: 'Email is required',
                userExists: false 
            }, { status: 400 });
        }

        await connectDB();
        console.log('Looking for user with email:', email.toLowerCase());
        const user = await User.findOne({ 
            email: { $regex: new RegExp('^' + email + '$', 'i') }
        });
        console.log('User found:', user ? 'Yes' : 'No');

        if (!user) {
            console.log('No user found with email:', email.toLowerCase());
            return NextResponse.json({ 
                error: 'No account found with this email address',
                userExists: false 
            }, { status: 404 });
        }

        console.log('Found user:', user.email);

        // Generate reset token (10 minutes expiry)
        const resetToken = generateAccessToken({
            id: user._id.toString(),
            email: user.email,
            purpose: 'password_reset'
        });

        // Create reset link with fallback to localhost for development
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
        console.log('Generated reset link:', resetLink);

        // Create email transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: parseInt(process.env.SMTP_PORT) || 465,
            secure: process.env.SMTP_SECURE === 'false' ? false : true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        try {
            console.log('Attempting to send email to:', email);
            // Send email
            await transporter.sendMail({
                from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
                to: email,
                subject: 'Password Reset Request - Chitramela',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background-color: #000; color: gold; padding: 20px; text-align: center;">
                            <h1>Password Reset Request</h1>
                        </div>
                        <div style="padding: 20px; background-color: #f9f9f9;">
                            <p>Dear ${user.email},</p>
                            <p>We received a request to reset your password. Click the button below to reset it. This link will expire in 10 minutes.</p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${resetLink}" style="background-color: gold; color: black; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                            </div>
                            <p>If you didn't request this, you can safely ignore this email.</p>
                            <p>For security reasons, this link will expire in 10 minutes.</p>
                            <p>If the button doesn't work, copy and paste this link into your browser:</p>
                            <p style="word-break: break-all; color: #666;">${resetLink}</p>
                        </div>
                        <div style="text-align: center; padding: 20px; font-size: 0.8em; color: #666;">
                            <p>This is an automated message. Please do not reply to this email.</p>
                        </div>
                    </div>
                `
            });
            console.log('Email sent successfully');

            return NextResponse.json({ 
                message: 'Reset link sent successfully',
                userExists: true 
            }, { status: 200 });

        } catch (emailError) {
            console.error('Email sending error:', emailError);
            return NextResponse.json({ 
                error: 'Failed to send reset email. Please try again later.',
                userExists: true 
            }, { status: 500 });
        }

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ 
            error: 'Failed to process request',
            userExists: false 
        }, { status: 500 });
    }
} 