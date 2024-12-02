"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { useRouter } from 'next/navigation';
import QR from "../../../Assets/DemoQR.png"
import Footer from '../../../components/Footer/Footer';
import './payment.css';
import backgroundImage from '../../../Assets/register3.webp';

function PaymentPage() {
    const router = useRouter();
    const [paymentData, setPaymentData] = useState({
        idNumber: '',
        email: '',
        paymentId: '',
    });
    const [showModal, setShowModal] = useState(false);
    const [registrationData, setRegistrationData] = useState(null);

    useEffect(() => {
        const storedData = sessionStorage.getItem('registrationData');
        if (!storedData) {
            router.push('/events/register');
            return;
        }
        setRegistrationData(JSON.parse(storedData));
    }, [router]);

    const handlePayment = async () => {
        if (!paymentData.idNumber || !paymentData.email || !paymentData.paymentId) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...paymentData,
                    registrationData
                })
            });

            if (response.ok) {
                setShowModal(true);
                // Clear session storage after successful payment
                setTimeout(() => {
                    sessionStorage.clear();
                    router.push('/');
                }, 5000);
            } else {
                alert('Payment verification failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    if (!registrationData) return null;

    return (
        <div className="payment-page" style={{ backgroundImage: `url(${backgroundImage.src})` }}>
            <div className="payment-page-in">
            <div className="payment-heading">
                <h1>Complete Your Payment</h1>
                <p>Secure payment gateway for Film Festival 2024</p>
                </div>
                <div className="payment-container">
                    <div className="payment-container-in">
                        <div className="payment-container-in-QR">
                            <div className="payment-container-in-QR-heading">
                                <h2>Scan QR Code</h2>
                            </div>
                            <div className="payment-container-in-QR-QR">
                                <Image src={QR} alt="Payment QR Code" />
                                <p>250Rs INR</p>
                            </div>
                            <div className="payment-container-in-QR-instruction">
                                <p>Scan this QR code with your payment app</p>
                            </div>
                        </div>
                        <div className="payment-container-in-form">
                        <div className="payment-form">
                    <h3>Payment Verification</h3>
                    <div className="form-group">
                        <label>ID Number</label>
                        <input 
                            type="text" 
                            placeholder="Enter your ID number"
                            onChange={(e) => setPaymentData({ ...paymentData, idNumber: e.target.value })} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            placeholder="Enter your email"
                            onChange={(e) => setPaymentData({ ...paymentData, email: e.target.value })} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Payment ID</label>
                        <input 
                            type="text" 
                            placeholder="Enter payment ID"
                            onChange={(e) => setPaymentData({ ...paymentData, paymentId: e.target.value })} 
                        />
                    </div>
                            <button onClick={handlePayment}>Verify Payment</button>
                        </div>
                        </div>
                    </div>
            </div>
            </div>
            <Footer />
            
            {showModal && (
                <div className="success-modal">
                    <div className="modal-content">
                        <h2>Thank You!</h2>
                        <p>Thanks for paying for the fest. Our team will reach out to you shortly regarding your payment verification.</p>
                        <div className="checkmark">✓</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PaymentPage; 