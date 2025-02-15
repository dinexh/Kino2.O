"use client";
import React, { useState } from 'react';
import Footer from '../../../components/Footer/Footer';
import backgroundImage from '../../../Assets/register3.webp';
import './register.css';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

function RegisterPage() {
    const router = useRouter();
    
    return (
        <div className="register-page-container">
            <div className="register-page" style={{ backgroundImage: `url(${backgroundImage.src})` }}>
                <div className="register-page-in">
                    <div className="register-heading">
                        <h1>Registrations Closed</h1>
                    </div>
                    <div className="register-description">
                        <p>Thank you for your interest in Chitramela 2025. Registrations are now closed.</p>
                        <p>For any queries, please contact us through our support page.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default RegisterPage; 