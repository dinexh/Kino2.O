import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        const { name, email, phone, issue, message } = await request.json();

        // Create transporter with direct credentials
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'chitramela2k25@gmail.com',
                pass: 'kzre qpwb opwp aoct'
            }
        });

        // Email content
        const mailOptions = {
            from: 'Chitramela <chitramela2k25@gmail.com>',
            to: '2300030350@kluniversity.in',
            subject: `Support Request: ${issue} from ${name}`,
            html: `
                <h2>New Support Request</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Issue Type:</strong> ${issue}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        // Send confirmation email to user
        const userMailOptions = {
            from: 'Chitramela <chitramela2k25@gmail.com>',
            to: email,
            subject: 'Support Request Received - Chitramela',
            html: `
                <h2>Thank you for contacting Chitramela Support</h2>
                <p>Dear ${name},</p>
                <p>We have received your support request regarding "${issue}". Our team will review your request and get back to you as soon as possible.</p>
                <p>Your request details:</p>
                <ul>
                    <li><strong>Issue Type:</strong> ${issue}</li>
                    <li><strong>Message:</strong> ${message}</li>
                </ul>
                <p>If you have any additional information to provide, please reply to this email.</p>
                <p>Best regards,<br>Chitramela Support Team</p>
            `
        };

        // Send emails
        await transporter.sendMail(mailOptions);
        await transporter.sendMail(userMailOptions);

        return new Response(JSON.stringify({ message: 'Support request sent successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Support request error:', error);
        return new Response(JSON.stringify({ error: 'Failed to send support request' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
} 