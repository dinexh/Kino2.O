import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Registration from '../model/registrations.js';

async function updateMissingSno() {
    try {
        // Connect to database
        await connectDB();
        console.log('Connected to database');

        // Find registrations without Sno
        const registrationsWithoutSno = await Registration.find({ Sno: null })
            .sort({ registrationDate: -1 })
            .lean();

        console.log(`\nFound ${registrationsWithoutSno.length} registrations without Sno`);

        if (registrationsWithoutSno.length > 0) {
            // Get the highest current Sno
            const highestRecord = await Registration.findOne({})
                .sort({ Sno: -1 })
                .lean();
            
            let nextSno = highestRecord?.Sno ? highestRecord.Sno + 1 : 1;

            // Update each registration
            for (const reg of registrationsWithoutSno) {
                await Registration.updateOne(
                    { _id: reg._id },
                    { $set: { Sno: nextSno } }
                );
                console.log(`Updated registration ${reg._id} (${reg.name}) with Sno: ${nextSno}`);
                nextSno++;
            }
        }

        // Show the most recent registrations after update
        const recentRegistrations = await Registration.find({})
            .sort({ registrationDate: -1 })
            .limit(5)
            .lean();

        console.log('\nMost recent 5 registrations after update:');
        recentRegistrations.forEach(reg => {
            console.log(`ID: ${reg._id}`);
            console.log(`Name: ${reg.name}`);
            console.log(`Registration Date: ${new Date(reg.registrationDate).toLocaleString()}`);
            console.log(`Sno: ${reg.Sno || 'NOT ASSIGNED'}`);
            console.log('-------------------');
        });

        process.exit(0);
    } catch (error) {
        console.error('Error updating registrations:', error);
        process.exit(1);
    }
}

// Run the update function
updateMissingSno(); 