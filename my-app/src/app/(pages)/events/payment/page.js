"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '../../../components/Footer/Footer';
import './payment.css';
import Image from 'next/image';
import DemoQR from '../../../Assets/DemoQR.png';
import { db } from '../../../../config/firebase';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { toast, Toaster } from 'react-hot-toast';

function PaymentPage() {
    const router = useRouter();
    const [registrationData, setRegistrationData] = useState(null);
    const [transactionId, setTransactionId] = useState('');

    useEffect(() => {
        // Retrieve registration data from session storage
        const data = sessionStorage.getItem('registrationData');
        if (data) {
            setRegistrationData(JSON.parse(data));
        } else {
            router.push('/events/register');
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!transactionId.trim()) {
            toast.error("Please enter the transaction ID");
            return;
        }

        // Verify phone number and name match
        const phoneMatch = registrationData.phoneNumber === document.querySelector('input[name="verifyPhone"]').value;
        const nameMatch = registrationData.name.toLowerCase() === document.querySelector('input[name="verifyName"]').value.toLowerCase();

        if (!phoneMatch || !nameMatch) {
            toast.error("Name and phone number must match your registration details");
            return;
        }

        const loadingToast = toast.loading("Processing payment...");

        try {
            // Get the registration document
            const registrationsRef = collection(db, 'registrations');
            const q = query(registrationsRef, where("email", "==", registrationData.email));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const registrationDoc = querySnapshot.docs[0];
                
                // Update payment status
                await updateDoc(doc(db, 'registrations', registrationDoc.id), {
                    paymentStatus: 'pending_verification',
                    transactionId: transactionId,
                    paymentDate: new Date()
                });

                // Clear session storage
                sessionStorage.removeItem('registrationData');

                toast.dismiss(loadingToast);
                toast.success("Payment recorded successfully! We will verify your payment and send you a confirmation email.");

                // Redirect to home page after a short delay
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.dismiss(loadingToast);
            toast.error("Failed to process payment. Please try again.");
        }
    };

    if (!registrationData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="payment-page">
            <Toaster
                position="top-right"
                toastOptions={{
                    success: {
                        duration: 3000,
                        style: {
                            background: '#4CAF50',
                            color: 'white',
                        },
                    },
                    error: {
                        duration: 4000,
                        style: {
                            background: '#EF5350',
                            color: 'white',
                        },
                    },
                    loading: {
                        style: {
                            background: '#2196F3',
                            color: 'white',
                        },
                    },
                }}
            />
            <div className="payment-container">
                <h1>Complete Your Payment</h1>
                <div className="payment-details">
                    <h2>Registration Summary</h2>
                    <p><strong>Name:</strong> {registrationData.name}</p>
                    <p><strong>Email:</strong> {registrationData.email}</p>
                    <p><strong>Selected Events:</strong></p>
                    <ul>
                        {registrationData.selectedEvents.map((event, index) => (
                            <li key={index}>{event}</li>
                        ))}
                    </ul>
                    <p><strong>Total Amount:</strong> ₹{registrationData.selectedEvents.length * 100}</p>
                </div>

                <div className="payment-instructions">
                    <h2>Payment Instructions</h2>
                    <p>1. Scan the QR code below using any UPI app</p>
                    <p>2. Pay the total amount shown above</p>
                    <p>3. Enter the transaction ID/UPI reference number below</p>
                    <p>4. Submit to complete your registration</p>
                </div>

                <div className="qr-code">
                    <Image 
                        src={DemoQR.src} 
                        alt="Payment QR Code" 
                        width={300} 
                        height={300}
                    />
                </div>

                <form onSubmit={handleSubmit} className="payment-form">
                    <div className="form-group">
                        <label>Verify Your Name: *</label>
                        <input
                            type="text"
                            name="verifyName"
                            placeholder="Enter your registered name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Verify Your Phone Number: *</label>
                        <input
                            type="tel"
                            name="verifyPhone"
                            placeholder="Enter your registered phone number"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Transaction ID / UPI Reference Number:</label>
                        <input
                            type="text"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            placeholder="Enter transaction ID"
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">Complete Registration</button>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default PaymentPage; 