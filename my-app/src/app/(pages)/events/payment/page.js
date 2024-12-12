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
    const [amt, Setamt] = useState('');
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);

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
        console.log("Form submitted with transaction ID:", transactionId); // Log transaction ID

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
                name: registrationData.name,
                email: registrationData.email,
                phoneNumber: registrationData.phoneNumber,
                profession: registrationData.profession,
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
        } catch (error) {
            console.error('Error:', error);
            toast.dismiss(loadingToast);
            toast.error("Failed to process payment. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    // Function to handle amount change
    const handleAmountChange = (e) => {
        const value = e.target.value;
        console.log("Amount entered:", value); // Log the entered amount
        if (value === '350') {
            Setamt(value);
            setShowTermsModal(true);
            console.log("Showing terms modal"); // Log when modal is shown
        } else {
            Setamt(value);
        }
    };

    // Function to handle terms acceptance
    const handleTermsAccept = () => {
        setIsTermsAccepted(true);
        setShowTermsModal(false);
        console.log("Terms accepted"); // Log when terms are accepted
    };

    // Modal component for terms
    const TermsModal = () => (
        <div className="terms-modal" onClick={() => setShowTermsModal(false)}>
            <div className="terms-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={() => setShowTermsModal(false)}>×</button>
                <h2>Terms and Conditions</h2>
                <p>Please read and accept the terms and conditions to proceed.</p>
                <h3>1. Payment Amount:</h3>
                <p>The total amount due for registration is ₹350. Participants are required to pay this exact amount. Payments of any other amount will not be accepted.</p>
                <h3>2. Transaction ID Requirement:</h3>
                <p>Upon completing the payment, you must provide a valid Transaction ID, UPI Reference, or UTR Number. This ID must correspond to the payment of ₹350 made through any UPI application.</p>
                <h3>3. Validity of Transaction ID:</h3>
                <p>Only unique and valid Transaction IDs will be accepted. Duplicate IDs or fake IDs will result in the rejection of your payment and registration.</p>
                <h3>4. Payment Confirmation:</h3>
                <p>After submitting your Transaction ID, your payment will be verified. You will receive a confirmation email once your payment has been successfully processed.</p>
                <h3>5. Refund Policy:</h3>
                <p>Payments are non-refundable once processed. Ensure that you are ready to complete the registration before making the payment.</p>
                <h3>6. Acceptance of Terms:</h3>
                <p>By proceeding with the payment, you acknowledge that you have read, understood, and agree to these terms and conditions. If you do not agree with any part of these terms, please do not proceed with the payment.</p>
                <h3>7. Contact Information:</h3>
                <p>For any queries or concerns regarding the payment process, please contact our support team at <a href="mailto:klsacphotography@gmail.com">support@example.com</a>.</p>
                <label>
                    <input
                        type="checkbox"
                        checked={isTermsAccepted}
                        onChange={(e) => setIsTermsAccepted(e.target.checked)}
                    />
                    I accept the terms and conditions
                </label>
                <button className='accept' onClick={handleTermsAccept} disabled={!isTermsAccepted}>
                    Accept and Continue
                </button>
            </div>
        </div>
    );

    // Telegram Popup Component
    const TelegramPopup = () => (
        <div className="telegram-popup" onClick={() => {
            setShowTelegramPopup(false);
            router.push('/'); // Redirect to homepage when closing the popup
        }}>
            <div className="telegram-content" onClick={(e) => e.stopPropagation()}>
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

                <div className="form-group">
                    <label>Enter Amount</label>
                    <input 
                        type="number"
                        value={amt}
                        onChange={handleAmountChange}
                        placeholder="₹350"
                        disabled={amt === '350'}
                    />
                </div>

                {isTermsAccepted && amt === '350' && (
                    <form onSubmit={handleSubmit} className="payment-form">
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
                )}
            </div>
            {showTermsModal && <TermsModal />}
            <Footer />
        </div>
    );
}

export default PaymentPage; 