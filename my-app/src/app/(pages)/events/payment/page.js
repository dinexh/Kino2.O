"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '../../../components/Footer/Footer';
import backgroundImage from '../../../Assets/register3.webp';
import './payment.css';
import Image from 'next/image';
import DemoQR from '../../../Assets/QR.png';
import { db } from '../../../../config/firebase';
import { doc, updateDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast, Toaster } from 'react-hot-toast';

function PaymentPage() {
    const router = useRouter();
    const [registrationData, setRegistrationData] = useState(null);
    const [transactionId, setTransactionId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [otherPaymentMethod, setOtherPaymentMethod] = useState('');
    const [showTelegramPopup, setShowTelegramPopup] = useState(false);

    // Payment methods array
    const paymentMethods = ['Google Pay', 'PhonePe', 'Paytm', 'Other'];

    useEffect(() => {
        // Retrieve registration data from session storage
        const data = sessionStorage.getItem('registrationData');
        if (data) {
            setRegistrationData(JSON.parse(data));
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!transactionId.trim()) {
            toast.error("Please enter the transaction ID/UPI reference/UTR number");
            return;
        }

        if (!paymentMethod) {
            toast.error("Please select a payment method");
            return;
        }

        if (paymentMethod === 'Other' && !otherPaymentMethod.trim()) {
            toast.error("Please specify the payment method");
            return;
        }

        const loadingToast = toast.loading("Processing payment...");
        setIsProcessing(true);

        try {
            // Get the registration document
            const registrationsRef = collection(db, 'newRegistrations');

            // Check if registrationData is defined and has all required fields
            if (!registrationData) {
                throw new Error("Registration data is not available.");
            }

            // Log registrationData for debugging
            console.log("Registration Data:", registrationData);

            // Create registration document directly
            const docRef = await addDoc(registrationsRef, {
                name: registrationData.name || '', // Default to empty string if undefined
                email: registrationData.email || '',
                phoneNumber: registrationData.phoneNumber || '',
                profession: registrationData.profession || 'unknown', // Default to 'unknown' if undefined
                idType: registrationData.profession === 'working' ? registrationData.idType || '' : null,
                idNumber: registrationData.idNumber || '',
                college: registrationData.profession === 'student' ? registrationData.college || '' : null,
                gender: registrationData.gender || '',
                referralName: registrationData.referralName || null,
                selectedEvents: registrationData.selectedEvents || [],
                registrationDate: serverTimestamp(),
                paymentStatus: 'pending_verification',
                transactionId: transactionId,
                paymentDate: new Date(),
                paymentMethod: paymentMethod === 'Other' ? otherPaymentMethod : paymentMethod
            });

            sessionStorage.removeItem('registrationData');
            toast.dismiss(loadingToast);
            toast.success("Payment recorded successfully! We will verify your payment and send you a confirmation email.");

            // Show Telegram popup instead of immediate redirect
            setShowTelegramPopup(true);
            
            // Redirect after 10 seconds
            setTimeout(() => {
                router.push('/');
            }, 10000);
        } catch (error) {
            console.error('Error:', error);
            toast.dismiss(loadingToast);
            toast.error("Failed to process payment. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    // Add this new function to handle popup close
    const handleClosePopup = () => {
        setShowTelegramPopup(false);
        router.push('/');
    };

    // Update the TelegramPopup component
    const TelegramPopup = () => (
        <div className="telegram-popup" onClick={handleClosePopup}>
            <div className="telegram-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={handleClosePopup}>×</button>
                <h2 className='success'>You've Successfully paid ₹350 towards Chitramela</h2>
                <h2>Join Our Telegram Group!</h2>
                <p>Stay updated with event details and connect with other participants</p>
                <a 
                    href="https://t.me/+qpJmuwnkAc5hMDVl" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="telegram-button"
                >
                    Join Telegram Group
                </a>
                <p className="redirect-notice">Click anywhere to continue to homepage</p>
            </div>
        </div>
    );

    if (!registrationData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="payment-page" style={{ backgroundImage: `url(${backgroundImage.src})` }}>
            <Toaster position="top-right" />
            {showTelegramPopup && <TelegramPopup />}
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
                    <p><strong>Total Amount:</strong> ₹350</p>
                </div>

                <div className="payment-instructions">
                    <h2>Payment Instructions</h2>
                    <p>1. Scan the QR code below using any UPI app</p>
                    <p>2. Pay the total amount shown above</p>
                    <p>3. Enter the transaction ID/UPI reference/UTR number below</p>
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
                        <label>Payment Method: *</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            required
                        >
                            <option value="">Select Payment Method</option>
                            {paymentMethods.map((method) => (
                                <option key={method} value={method}>{method}</option>
                            ))}
                        </select>
                    </div>

                    {paymentMethod === 'Other' && (
                        <div className="form-group">
                            <label>Specify Payment Method: *</label>
                            <input
                                type="text"
                                value={otherPaymentMethod}
                                onChange={(e) => setOtherPaymentMethod(e.target.value)}
                                placeholder="Enter payment method name"
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Transaction ID / UPI Reference / UTR Number: *</label>
                        <input
                            type="text"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            placeholder="Enter transaction ID/UPI reference/UTR number"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="submit-button" 
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Processing...' : 'Complete Registration'}
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default PaymentPage; 