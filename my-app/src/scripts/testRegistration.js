import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Registration from '../model/registrations.js';

async function testNewRegistration() {
    try {
        // Connect to database
        await connectDB();
        console.log('Connected to database');

        // Create a test registration
        const testRegistration = new Registration({
            name: "Test User",
            email: "test" + Date.now() + "@test.com", // Unique email
            phoneNumber: "1234" + Date.now().toString().slice(-6), // Unique phone
            profession: "student",
            gender: "male",
            selectedEvents: ["Photography Contest"],
            idNumber: "TEST" + Date.now(),
            college: "Test College",
            transactionId: "TEST" + Date.now(), // Unique transaction ID
            paymentMethod: "Google Pay"
        });

        // Save the registration
        const savedRegistration = await testRegistration.save();
        console.log('\nNew registration created:');
        console.log(`ID: ${savedRegistration._id}`);
        console.log(`Name: ${savedRegistration.name}`);
        console.log(`Sno: ${savedRegistration.Sno}`);
        console.log(`Registration Date: ${new Date(savedRegistration.registrationDate).toLocaleString()}`);

        // Get the most recent 5 registrations to verify
        const recentRegistrations = await Registration.find({})
            .sort({ registrationDate: -1 })
            .limit(5)
            .lean();

        console.log('\nMost recent 5 registrations:');
        recentRegistrations.forEach(reg => {
            console.log(`ID: ${reg._id}`);
            console.log(`Name: ${reg.name}`);
            console.log(`Sno: ${reg.Sno || 'NOT ASSIGNED'}`);
            console.log(`Registration Date: ${new Date(reg.registrationDate).toLocaleString()}`);
            console.log('-------------------');
        });

        process.exit(0);
    } catch (error) {
        console.error('Error creating test registration:', error);
        process.exit(1);
    }
}

// Run the test
testNewRegistration(); 