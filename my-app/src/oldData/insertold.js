import fs from 'fs';
import path from 'path';
import Registration from '../model/registrations.js';
import connectDB from '../config/db.js';

// Function to transform Firebase data to MongoDB schema
function transformRegistrationData(firebaseData) {
    // Normalize payment method
    let paymentMethod = firebaseData.paymentMethod;
    let otherPaymentMethod = null;

    // Check if payment method is in allowed enum values
    const allowedPaymentMethods = ['Google Pay', 'PhonePe', 'Paytm', 'Other'];
    if (!allowedPaymentMethods.includes(paymentMethod)) {
        otherPaymentMethod = paymentMethod;
        paymentMethod = 'Other';
    }

    return {
        name: firebaseData.name,
        email: firebaseData.email,
        phoneNumber: firebaseData.phoneNumber,
        college: firebaseData.college || null,
        profession: firebaseData.profession || 'student',
        gender: firebaseData.gender.toLowerCase(),
        referralName: firebaseData.referralName || null,
        selectedEvents: Array.isArray(firebaseData.selectedEvents) 
            ? firebaseData.selectedEvents 
            : [],
        registrationDate: new Date(firebaseData.registrationDate),
        paymentStatus: firebaseData.paymentStatus === 'verified' 
            ? 'verified'
            : 'pending_verification',
        transactionId: firebaseData.transactionId,
        paymentDate: firebaseData.paymentDate ? new Date(firebaseData.paymentDate) : new Date(),
        paymentMethod: paymentMethod,
        otherPaymentMethod: otherPaymentMethod,
        idNumber: firebaseData.idNumber,
        idType: firebaseData.idType || null
    };
}

// Function to insert data from JSON file
async function insertData() {
    try {
        // Read data from JSON file
        const filePath = path.join(process.cwd(), 'src', 'oldData', 'backup.json');
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        
        console.log(`Found ${data.newRegistrations?.length || 0} registrations to import`);
        
        let successCount = 0;
        let errorCount = 0;
        
        // Process each registration
        for (const registration of data.newRegistrations || []) {
            try {
                // Transform the data to match our schema
                const transformedData = transformRegistrationData(registration);
                
                // Check each duplicate condition separately
                const emailExists = await Registration.findOne({ email: transformedData.email });
                const phoneExists = await Registration.findOne({ phoneNumber: transformedData.phoneNumber });
                const transactionExists = await Registration.findOne({ transactionId: transformedData.transactionId });
                
                if (emailExists || phoneExists || transactionExists) {
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
                console.log(`Successfully imported: ${transformedData.name} (${successCount}/${data.newRegistrations.length})`);
            } catch (error) {
                errorCount++;
                console.error(`Error importing registration for ${registration.email}:`, error.message);
                // Log more details about the error
                if (error.name === 'ValidationError') {
                    Object.keys(error.errors).forEach(key => {
                        console.error(`- ${key}: ${error.errors[key].message}`);
                    });
                }
            }
        }
        
        console.log('\nImport Summary:');
        console.log(`Total processed: ${data.newRegistrations?.length || 0}`);
        console.log(`Successfully imported: ${successCount}`);
        console.log(`Errors: ${errorCount}`);
        
    } catch (error) {
        console.error('Error in data import:', error);
        throw error;
    }
}

// Main function to run the script
async function main() {
    try {
        await connectDB();
        await insertData();
        console.log('Import completed');
    } catch (error) {
        console.error('Import failed:', error);
    } finally {
        await disconnectDB();
        console.log('Database connection closed');
    }
}

// Run the script
main();
