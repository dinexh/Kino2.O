'use client';

import './support.css';
import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

export default function SupportPage() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const loadingToast = toast.loading('Sending your request...');

        const formData = {
            name: e.target.name.value,
            email: e.target.email.value,
            phone: e.target.phone.value,
            issue: e.target.issue.value,
            message: e.target.message.value,
        };

        try {
            const response = await fetch('/api/support', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send support request');
            }

            toast.success('Support request sent successfully! We\'ll get back to you soon.', {
                id: loadingToast,
                duration: 5000,
            });
            e.target.reset();
        } catch (err) {
            toast.error(err.message, {
                id: loadingToast,
                duration: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="support-page">
            <Toaster 
                position="top-right"
                toastOptions={{
                    success: {
                        style: {
                            background: 'rgba(0, 255, 0, 0.1)',
                            color: '#00ff00',
                            border: '1px solid rgba(0, 255, 0, 0.2)',
                        },
                    },
                    error: {
                        style: {
                            background: 'rgba(255, 0, 0, 0.1)',
                            color: '#ff0000',
                            border: '1px solid rgba(255, 0, 0, 0.2)',
                        },
                    },
                    loading: {
                        style: {
                            background: 'rgba(255, 215, 0, 0.1)',
                            color: '#ffd700',
                            border: '1px solid rgba(255, 215, 0, 0.2)',
                        },
                    },
                }}
            />
            <div className="support-page-in">
                <div className="support-page-in-heading">
                    <h1>Chitramela Support</h1>
                </div>
                <div className="support-page-in-content">
                    <div className="support-page-in-content-in-form">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    placeholder="Enter your name"
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    placeholder="Enter your email"
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone</label>
                                <input 
                                    type="tel" 
                                    id="phone" 
                                    name="phone" 
                                    placeholder="Enter your phone number"
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="issue">Issue Type</label>
                                <select id="issue" name="issue" required>
                                    <option value="">Select an issue</option>
                                    <option value="Registration">Registration</option>
                                    <option value="Payment">Payment</option>
                                    <option value="Technical">Technical Support</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea 
                                    id="message" 
                                    name="message" 
                                    placeholder="Describe your issue in detail..."
                                    required
                                />
                            </div>
                            <button type="submit" disabled={loading}>
                                {loading ? 'Sending...' : 'Submit Request'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
