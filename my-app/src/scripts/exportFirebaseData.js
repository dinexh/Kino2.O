import { getFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseApp from '../config/firebase.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firestore
const db = getFirestore(firebaseApp);

// Configure nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function exportFirebaseData() {
    try {
        console.log('Starting data export from Firebase...');
        
        // Get all registrations from Firebase
        const registrationsRef = collection(db, 'registrations');
        const snapshot = await getDocs(registrationsRef);
        
        // Convert documents to array of data
        const registrations = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log(`Found ${registrations.length} registrations`);

        // Create the export directory if it doesn't exist
        const exportDir = path.join(__dirname, '../exports');
        await fs.mkdir(exportDir, { recursive: true });

        // Create filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `registrations_${timestamp}.json`;
        const filepath = path.join(exportDir, filename);

        // Write data to file
        await fs.writeFile(filepath, JSON.stringify(registrations, null, 2));
        console.log(`Data written to ${filepath}`);

        // Send email with attachment
        const mailOptions = {
            from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
            to: process.env.SMTP_USER, // Using SMTP_USER as recipient
            subject: 'Firebase Registrations Export',
            text: `Please find attached the exported registrations data from Firebase.\nTotal registrations: ${registrations.length}\nExport time: ${new Date().toLocaleString()}`,
            attachments: [{
                filename,
                path: filepath
            }]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);

        // Clean up: delete the file after sending
        await fs.unlink(filepath);
        console.log('Temporary file deleted');

        console.log('Export process completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Export failed:', error);
        process.exit(1);
    }
}

// Run the export function
exportFirebaseData(); 