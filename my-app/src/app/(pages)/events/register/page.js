"use client";
import React, { useState } from 'react';
import Footer from '../../../components/Footer/Footer';
import backgroundImage from '../../../Assets/register3.webp';
import './register.css';
import { useRouter } from 'next/navigation';

function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        idNumber: '',
        phoneNumber: '',
        college: '',
        gender: '',
        referralName: '',
        selectedEvents: []
    });

    const events = [
        "Photography Contest - Mobile Photograph",
        "Short Film Screening",
        "Reel Making Contest",
        "Movie Poster Design Contest"
    ];

    const handleEventSelection = (event) => {
        if (event === 'all') {
            if (formData.selectedEvents.length === events.length) {
                setFormData({ ...formData, selectedEvents: [] });
            } else {
                setFormData({ ...formData, selectedEvents: [...events] });
            }
        } else {
            const updatedEvents = formData.selectedEvents.includes(event)
                ? formData.selectedEvents.filter(e => e !== event)
                : [...formData.selectedEvents, event];
            setFormData({ ...formData, selectedEvents: updatedEvents });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log('Submitting form data:', formData);

        // Basic validation
        if (!formData.name || !formData.email || !formData.idNumber || 
            !formData.phoneNumber || !formData.college || !formData.gender || 
            formData.selectedEvents.length === 0) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                sessionStorage.setItem('registrationData', JSON.stringify({
                    ...formData,
                    idCardUploadLink: result.data.idCardUploadLink
                }));
                router.push('/events/confirmation');
            } else {
                alert(result.error || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="register-page" style={{ backgroundImage: `url(${backgroundImage.src})` }}>
            <div className="register-page-in">
                <div className="register-heading">
                    <h1>Register for Chitramela 2025</h1>
                </div>
                <div className="register-description">
                    <p>Join us for an extraordinary celebration of cinema</p>
                </div>
                <div className="register-form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name: *</label>
                        <input 
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email: *</label>
                        <input 
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="210000..@kluniversity.in"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>ID Number: *</label>
                        <input 
                            type="text"
                            value={formData.idNumber}
                            onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                            placeholder="2100031234"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone Number: *</label>
                        <input 
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            placeholder="+91 9876543210"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>College: *</label>
                        <input 
                            type="text"
                            value={formData.college}
                            onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                            placeholder="KL University"
                            required
                        />
                    </div>

                    <div className="form-group-notice-box">
                      <label htmlFor="idCardUploadLink">ID Card Link *</label>
                      <input 
                        type="text" 
                        id="idCardUploadLink" 
                        value={formData.idCardUploadLink} 
                        onChange={(e) => setFormData({ ...formData, idCardUploadLink: e.target.value })} 
                        placeholder="Enter ID Card Link"
                        required 
                      />
                      <p>Upload ID Card as a link </p>
                      <p>Please refer to this video for more details</p> <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Video Link</a>
                    </div>

                    <div className="form-group">
                        <label>Gender: *</label>
                        <select 
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Referral Name:</label>
                        <input 
                            type="text"
                            value={formData.referralName}
                            onChange={(e) => setFormData({ ...formData, referralName: e.target.value })}
                            placeholder="Enter referral name (if any)"
                        />
                    </div>

                    <div className="form-group events-section">
                        <label>Selected Events: *</label>
                        <button 
                            type="button" 
                            className={`event-button ${formData.selectedEvents.length === events.length ? 'selected' : ''}`}
                            onClick={() => handleEventSelection('all')}
                        >
                            Select All Events
                        </button>
                        <div className="events-grid">
                            {events.map((event, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={`event-button ${formData.selectedEvents.includes(event) ? 'selected' : ''}`}
                                    onClick={() => handleEventSelection(event)}
                                >
                                    {event}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="submit-button">Next</button>
                </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default RegisterPage; 