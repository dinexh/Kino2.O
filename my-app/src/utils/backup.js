import { db } from '../config/firebase';
import { collection, getDocs, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';

const downloadAsJSON = (data, filename) => {
    if (typeof window !== 'undefined') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};

export const createBackup = async () => {
    try {
        // Get all registrations
        const registrationsRef = collection(db, 'newRegistrations');
        const workshopsRef = collection(db, 'workshopRegistrations');
        
        // Query the collections
        const registrationsQuery = query(registrationsRef, orderBy('paymentDate', 'desc'));
        const workshopsQuery = query(workshopsRef, orderBy('registrationDate', 'desc'));
        
        // Get the documents
        const [registrationsSnapshot, workshopsSnapshot] = await Promise.all([
            getDocs(registrationsQuery),
            getDocs(workshopsQuery)
        ]);

        // Convert snapshots to data
        const registrationsData = registrationsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        const workshopsData = workshopsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Create backup document
        const backupRef = collection(db, 'backups');
        const backupData = {
            timestamp: serverTimestamp(),
            registrations: registrationsData,
            workshops: workshopsData,
            totalRegistrations: registrationsData.length,
            totalWorkshops: workshopsData.length,
            verifiedRegistrations: registrationsData.filter(reg => reg.paymentStatus === 'verified').length,
            totalAmount: registrationsData.filter(reg => reg.paymentStatus === 'verified').length * 350
        };

        // Save to Firestore
        await addDoc(backupRef, backupData);

        // Download local backup
        const date = new Date().toISOString().split('T')[0];
        downloadAsJSON(backupData, `chitramela-backup-${date}.json`);

        return {
            success: true,
            message: 'Backup created successfully and downloaded locally'
        };
    } catch (error) {
        console.error('Error creating backup:', error);
        return {
            success: false,
            message: error.message
        };
    }
}; 