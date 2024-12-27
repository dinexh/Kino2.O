import { getFirestore, collection, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import firebaseApp from '../config/firebase';

const db = getFirestore(firebaseApp);

export async function addRegistrationToFirebase(registration) {
    try {
        const registrationsRef = collection(db, 'registrations');
        const docData = {
            ...registration.toObject(),
            _id: registration._id.toString(),
            registrationDate: registration.registrationDate ? registration.registrationDate.toISOString() : new Date().toISOString(),
            paymentDate: registration.paymentDate ? registration.paymentDate.toISOString() : new Date().toISOString()
        };
        const docRef = await addDoc(registrationsRef, docData);
        console.log('Registration added to Firebase with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error adding registration to Firebase:', error);
        throw error;
    }
}

export async function updateRegistrationInFirebase(registrationId, updates) {
    try {
        const registrationRef = doc(db, 'registrations', registrationId);
        await updateDoc(registrationRef, {
            ...updates,
            updatedAt: new Date().toISOString()
        });
        console.log('Registration updated in Firebase:', registrationId);
    } catch (error) {
        console.error('Error updating registration in Firebase:', error);
        throw error;
    }
}

export async function deleteRegistrationFromFirebase(registrationId) {
    try {
        const registrationRef = doc(db, 'registrations', registrationId);
        await deleteDoc(registrationRef);
        console.log('Registration deleted from Firebase:', registrationId);
    } catch (error) {
        console.error('Error deleting registration from Firebase:', error);
        throw error;
    }
} 