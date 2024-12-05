"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '../../../components/Footer/Footer';
import './payment.css';
import DemoQR from '../../../Assets/DemoQR.png';
import { db } from '../../../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';

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
            alert('Please enter the transaction ID');
            return;
        }

        try {
            // Update the registration document with payment details
            const registrationRef = doc(db, 'registrations', registrationData.registrationId);
            await updateDoc(registrationRef, {
                transactionId: transactionId,
                paymentStatus: 'submitted',
                paymentTimestamp: new Date()
            });

            // Clear session storage
            sessionStorage.removeItem('registrationData');

            // Redirect to success page or home
            router.push('/');
            alert('Registration completed successfully! We will verify your payment and send you a confirmation email.');
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    if (!registrationData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="payment-page">
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
                    <img src={DemoQR.src} alt="Payment QR Code" />
                </div>

                <form onSubmit={handleSubmit} className="payment-form">
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