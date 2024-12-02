"use client";
import React, { useEffect, useState } from 'react';
import Footer from '../../../components/Footer/Footer';
import backgroundImage from '../../../Assets/register3.webp';
import './confirmation.css';
import { useRouter } from 'next/navigation';

function ConfirmationPage() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const storedData = sessionStorage.getItem('registrationData');
        if (!storedData) {
            router.push('/events/register');
            return;
        }
        setUserData(JSON.parse(storedData));
    }, [router]);

    const GoToPayment = () => {
        router.push('/events/payment');
    }

    const GoBackToEdit = () => {
        router.push('/events/register');
    }

    if (!userData) return null;

    return (
        <div className="confirmation-page" style={{ backgroundImage: `url(${backgroundImage.src})` }}>
            <div className="confirmation-page-in">
                <div className="confirmation-heading">
                    <h1>Confirm Your Registration</h1>
                    <p>Please review your details below</p>
                </div>
                <div className="confirmation-container">
                    <div className="confirmation-container-heading">
                        <h2>Registration Details</h2>
                    </div>
                    <div className="confirmation-container-details">
                        <div className="details-grid">
                            <div className="detail-item">
                                <span className="label">Event</span>
                                <span className="value">{userData?.eventName}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Name</span>
                                <span className="value">{userData?.name}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Email</span>
                                <span className="value">{userData?.email}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Phone Number</span>
                                <span className="value">{userData?.phoneNumber}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">ID Number</span>
                                <span className="value">{userData?.idNumber}</span>
                            </div>
                        </div>
                    </div>
                    <div className="button-group">
                        <button className="edit-button" onClick={GoBackToEdit}>Back to Edit</button>
                        <button className="proceed-button" onClick={GoToPayment}>Proceed to Payment</button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ConfirmationPage; 