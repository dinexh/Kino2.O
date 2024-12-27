import nodemailer from 'nodemailer';

// Create reusable transporter object using Gmail SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_APP_PASSWORD
    }
});

export const sendEmail = async ({ to, subject, html }) => {
    try {
        // Verify SMTP connection configuration
        await transporter.verify();

        const info = await transporter.sendMail({
            from: `"chitramela" <chitramela2k25@gmail.com>`,
            to,
            subject,
            html,
            priority: 'high'
        });

        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        // Log detailed error information
        if (error.code === 'ESOCKET') {
            console.error('SMTP Connection Error Details:', {
                code: error.code,
                command: error.command,
                syscall: error.syscall,
                errno: error.errno
            });
        }
        return { success: false, error: error.message };
    }
}; 