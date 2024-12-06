"use client";
import React, { useState } from 'react';
import Footer from '../../../components/Footer/Footer';
import backgroundImage from '../../../Assets/register3.webp';
import './register.css';
import { useRouter } from 'next/navigation';

function RegisterPage() {
    const router = useRouter();
    const countryCodes = [
        { code: '+91', country: 'India' },
        { code: '+1', country: 'USA/Canada' },
        { code: '+44', country: 'UK' },
        { code: '+61', country: 'Australia' },
        { code: '+86', country: 'China' },
        { code: '+81', country: 'Japan' },
        { code: '+971', country: 'UAE' },
        { code: '+65', country: 'Singapore' },
        { code: '+60', country: 'Malaysia' },
        { code: '+49', country: 'Germany' },
        { code: '+33', country: 'France' },
        { code: '+39', country: 'Italy' },
        { code: '+34', country: 'Spain' },
        { code: '+7', country: 'Russia' },
        { code: '+82', country: 'South Korea' },
        { code: '+55', country: 'Brazil' },
        { code: '+52', country: 'Mexico' },
        { code: '+966', country: 'Saudi Arabia' },
        { code: '+27', country: 'South Africa' },
        { code: '+64', country: 'New Zealand' },
        { code: '+31', country: 'Netherlands' },
        { code: '+46', country: 'Sweden' },
        { code: '+47', country: 'Norway' },
        { code: '+45', country: 'Denmark' },
        { code: '+41', country: 'Switzerland' },
        { code: '+353', country: 'Ireland' },
        { code: '+351', country: 'Portugal' },
        { code: '+92', country: 'Pakistan' },
        { code: '+880', country: 'Bangladesh' },
        { code: '+94', country: 'Sri Lanka' },
        { code: '+977', country: 'Nepal' },
        { code: '+975', country: 'Bhutan' },
        { code: '+95', country: 'Myanmar' },
        { code: '+84', country: 'Vietnam' },
        { code: '+62', country: 'Indonesia' },
        { code: '+66', country: 'Thailand' },
        { code: '+63', country: 'Philippines' },
    ].sort((a, b) => {
        // Sort by country name, but keep India first
        if (a.country === 'India') return -1;
        if (b.country === 'India') return 1;
        return a.country.localeCompare(b.country);
    });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        idNumber: '',
        phoneNumber: '',
        countryCode: '+91',
        college: '',
        gender: '',
        referralName: '',
        selectedEvents: [],
        idCardUploadLink: ''
    });

    const events = [
        "Photography Contest - Mobile Photograph",
        "Short Film Screening",
        "Reel Making Contest",
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
        
        // Basic validation
        if (!formData.name || !formData.email || !formData.idNumber || 
            !formData.phoneNumber || !formData.college || !formData.gender || 
            formData.selectedEvents.length === 0) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            // Store registration data in session storage
            sessionStorage.setItem('registrationData', JSON.stringify({
                ...formData,
                registrationId: Date.now().toString() // Temporary ID for demo
            }));

            router.push('/events/payment');
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

                    <div className="form-group phone-group">
                        <label>Phone Number: *</label>
                        <div className="phone-input-container">
                            <select
                                value={formData.countryCode}
                                onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                                className="country-code-select"
                            >
                                {countryCodes.map((country) => (
                                    <option key={country.code} value={country.code}>
                                        {country.code} ({country.country})
                                    </option>
                                ))}
                            </select>
                            <input 
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                placeholder="9876543210"
                                required
                            />
                        </div>
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
                        <div className="events-container">
                            <button 
                                type="button" 
                                className={`select-all-button ${formData.selectedEvents.length === events.length ? 'selected' : ''}`}
                                onClick={() => handleEventSelection('all')}
                            >
                                {formData.selectedEvents.length === events.length ? 'Unselect All' : 'Select All Events'}
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