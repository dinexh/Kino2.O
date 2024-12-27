import { getFirestore, collection, addDoc } from 'firebase/firestore';
import firebaseApp from '../config/firebase.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = getFirestore(firebaseApp);

async function importToFirebase() {
    try {
        // Read the backup file
        const backupPath = path.join(__dirname, 'backup.json');
        const data = await fs.readFile(backupPath, 'utf8');
        const registrations = JSON.parse(data);

        if (!Array.isArray(registrations)) {
            throw new Error('Invalid data format: expected an array of registrations');
        }

        // Log the first registration to check structure
        console.log('Sample registration data:', JSON.stringify(registrations[0], null, 2));

        console.log(`Found ${registrations.length} registrations to import`);
        const registrationsRef = collection(db, 'registrations');

        let successCount = 0;
        let errorCount = 0;

        // Import each registration
        for (const reg of registrations) {
            try {
                if (!reg || typeof reg !== 'object') {
                    console.error('Invalid registration data:', reg);
                    errorCount++;
                    continue;
                }

                // Split selected events string into array if it exists
                let selectedEvents = [];
                if (reg['Selected Events']) {
                    selectedEvents = reg['Selected Events'].split(';').map(event => event.trim());
                }

                // Create a clean object without MongoDB-specific fields
                const docData = {
                    name: reg['Name'] || '',
                    email: reg['Email'] || '',
                    phoneNumber: reg['Phone'] || '',
                    profession: reg['Profession'] || '',
                    idType: reg['ID Type'] || null,
                    idNumber: reg['ID Number'] || '',
                    college: reg['College'] || null,
                    gender: reg['Gender'] || '',
                    referralName: reg['Referral Name'] || null,
                    selectedEvents: selectedEvents,
                    registrationDate: reg['Registration Date'] || new Date().toISOString(),
                    paymentStatus: reg['Payment Status'] || 'pending_verification',
                    transactionId: reg['Transaction ID'] || '',
                    paymentDate: reg['Payment Date'] || new Date().toISOString(),
                    paymentMethod: reg['Payment Method'] || '',
                    otherPaymentMethod: reg['Other Payment Method'] || null
                };

                // Clean up phone number and ID number (remove quotes if present)
                if (docData.phoneNumber) {
                    docData.phoneNumber = docData.phoneNumber.replace(/['"]+/g, '');
                }
                if (docData.idNumber) {
                    docData.idNumber = docData.idNumber.replace(/['"]+/g, '');
                }

                // Log the data being imported
                console.log('Importing data:', docData);

                await addDoc(registrationsRef, docData);
                console.log(`Imported registration for: ${docData.name}`);
                successCount++;
            } catch (error) {
                console.error(`Failed to import registration for: ${reg['Name'] || 'unknown'}`, error);
                errorCount++;
            }
        }

        console.log(`Import completed. Success: ${successCount}, Errors: ${errorCount}`);
        process.exit(0);
    } catch (error) {
        console.error('Import failed:', error);
        process.exit(1);
    }
}

importToFirebase(); 