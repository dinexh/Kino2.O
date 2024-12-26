import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    },
    debug: true // Enable debug logs
});

export const sendEmail = async ({ to, subject, html }) => {
    try {
        // Verify SMTP connection configuration
        await transporter.verify();

        const info = await transporter.sendMail({
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
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