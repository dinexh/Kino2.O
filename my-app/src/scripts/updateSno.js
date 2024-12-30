import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../../.env.local') });

// MongoDB connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
        return conn;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

// Registration Schema
const registrationSchema = new mongoose.Schema({
    Sno: Number,
    name: String,
    email: String,
    phoneNumber: String,
    college: String,
    profession: String,
    gender: String,
    referralName: String,
    selectedEvents: [String],
    registrationDate: Date,
    paymentStatus: String,
    transactionId: String,
    paymentDate: Date,
    paymentMethod: String,
    otherPaymentMethod: String,
    idNumber: String,
    idType: String
});

const Registration = mongoose.models.Registration || mongoose.model('Registration', registrationSchema);

async function updateRegistrationSno() {
    try {
        // Connect to database
        await connectDB();
        console.log('Connected to database');

        // Get all registrations sorted by registration date (oldest first)
        const registrations = await Registration.find({})
            .sort({ registrationDate: 1 });

        console.log(`Found ${registrations.length} registrations to update`);

        // Update each registration with sequential Sno
        let currentSno = 1;
        for (const registration of registrations) {
            registration.Sno = currentSno++;
            await registration.save({ validateBeforeSave: false }); // Skip validation to avoid unique constraint issues
            console.log(`Updated registration ${registration._id} with Sno ${registration.Sno}`);
        }

        console.log('Successfully updated all registrations');
        process.exit(0);
    } catch (error) {
        console.error('Error updating registrations:', error);
        process.exit(1);
    }
}

// Run the update function
updateRegistrationSno(); 