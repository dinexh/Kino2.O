import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Registration from '../model/registrations.js';
import connectDB from '../config/db.js';

// Function to transform Firebase data to MongoDB schema
function transformRegistrationData(data) {
    // Extract selected events from string and convert to array
    const selectedEvents = data['Selected Events'] ? data['Selected Events'].split(';').map(e => e.trim()) : [];

    // Normalize payment method
    let paymentMethod = data['Payment Method'];
    let otherPaymentMethod = null;

    // Check if payment method is in allowed enum values
    const allowedPaymentMethods = ['Google Pay', 'PhonePe', 'Paytm', 'Other'];
    if (!allowedPaymentMethods.includes(paymentMethod)) {
        otherPaymentMethod = paymentMethod;
        paymentMethod = 'Other';
    } else if (paymentMethod === 'Other' && !otherPaymentMethod) {
        // If payment method is explicitly 'Other', use it as otherPaymentMethod too
        otherPaymentMethod = paymentMethod;
    }

    // Clean phone number by removing quotes and plus sign
    const phoneNumber = data['Phone'] ? data['Phone'].replace(/['"+ ]/g, '') : '';

    // Clean ID number by removing quotes
    const idNumber = data['ID Number'] ? data['ID Number'].replace(/['" ]/g, '') : '';

    // Create the transformed data object
    const transformedData = {
        name: data['Name'],
        email: data['Email'].toLowerCase(),
        phoneNumber: phoneNumber,
        college: data['College'] || null,
        profession: data['Profession'] || 'student',
        gender: data['Gender'].toLowerCase(),
        referralName: data['Referral Name'] || null,
        selectedEvents: selectedEvents,
        registrationDate: new Date(data['Registration Date']),
        paymentStatus: data['Payment Status'] === 'verified' ? 'verified' : 'pending_verification',
        transactionId: data['Transaction ID'] ? data['Transaction ID'].replace(/['" ]/g, '') : '',
        paymentDate: data['Payment Date'] ? new Date(data['Payment Date']) : new Date(),
        paymentMethod: paymentMethod,
        idNumber: idNumber,
        idType: data['ID Type'] || null
    };

    // Only add otherPaymentMethod if paymentMethod is 'Other'
    if (paymentMethod === 'Other') {
        transformedData.otherPaymentMethod = otherPaymentMethod;
    }

    return transformedData;
}

// Function to insert data from JSON file
async function insertData() {
    try {
        // Read data from JSON file
        const filePath = path.join(process.cwd(), 'src', 'oldData', 'backup2.json');
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        
        // Convert object to array if it's not already an array
        const registrations = Array.isArray(data) ? data : [data];
        
        console.log(`Found ${registrations.length} registrations to import`);
        
        let successCount = 0;
        let errorCount = 0;
        let duplicateCount = 0;
        
        // Process each registration
        for (const registration of registrations) {
            try {
                // Transform the data to match our schema
                const transformedData = transformRegistrationData(registration);
                
                // Check each duplicate condition separately
                const emailExists = await Registration.findOne({ email: transformedData.email });
                const phoneExists = await Registration.findOne({ phoneNumber: transformedData.phoneNumber });
                const transactionExists = transformedData.transactionId ? 
                    await Registration.findOne({ transactionId: transformedData.transactionId }) : 
                    false;
                
                if (emailExists || phoneExists || transactionExists) {
                    duplicateCount++;
                    console.log(`Skipping duplicate registration for ${transformedData.name}:`);
                    if (emailExists) console.log(`- Email already exists: ${transformedData.email}`);
                    if (phoneExists) console.log(`- Phone already exists: ${transformedData.phoneNumber}`);
                    if (transactionExists) console.log(`- Transaction ID already exists: ${transformedData.transactionId}`);
                    continue;
                }
                
                // Create new registration
                const newRegistration = new Registration(transformedData);
                await newRegistration.save();
                
                successCount++;
                console.log(`Successfully imported: ${transformedData.name} (${successCount}/${registrations.length})`);
            } catch (error) {
                errorCount++;
                console.error(`Error importing registration for ${registration.Email}:`, error.message);
                // Log more details about the error
                if (error.name === 'ValidationError') {
                    Object.keys(error.errors).forEach(key => {
                        console.error(`- ${key}: ${error.errors[key].message}`);
                    });
                }
            }
        }
        
        console.log('\nImport Summary:');
        console.log(`Total processed: ${registrations.length}`);
        console.log(`Successfully imported: ${successCount}`);
        console.log(`Duplicates skipped: ${duplicateCount}`);
        console.log(`Errors: ${errorCount}`);
        
    } catch (error) {
        console.error('Error in data import:', error);
        throw error;
    }
}

// Main function to run the script
async function main() {
    try {
        console.log('Connecting to MongoDB...');
        await connectDB();
        console.log('MongoDB connection status:', mongoose.connection.readyState);
        
        console.log('Reading backup.json file...');
        const filePath = path.join(process.cwd(), 'src', 'oldData', 'backup.json');
        if (!fs.existsSync(filePath)) {
            throw new Error(`backup.json not found at ${filePath}`);
        }
        
        await insertData();
        console.log('Import completed');
    } catch (error) {
        console.error('Import failed:', error);
        if (error.code === 'ENOENT') {
            console.error('Could not find backup.json file');
        } else if (error.name === 'MongooseError') {
            console.error('MongoDB connection error:', error.message);
        } else {
            console.error('Unexpected error:', error.message);
        }
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('Database connection closed');
        }
    }
}

// Run the script
main();
