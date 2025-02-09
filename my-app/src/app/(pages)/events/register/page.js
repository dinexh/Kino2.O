"use client";
import React, { useState } from 'react';
import Footer from '../../../components/Footer/Footer';
import backgroundImage from '../../../Assets/register3.webp';
import './register.css';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

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
        if (a.country === 'India') return -1;
        if (b.country === 'India') return 1;
        return a.country.localeCompare(b.country);
    });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        countryCode: '+91',
        profession: '',
        idType: '',
        idNumber: '',
        college: '',
        gender: '',
        referralName: '',
        selectedEvents: [],
        password: '',
        confirmPassword: '',
    });

    const events = [
        "Photography Contest",
        "Short Film Contest",
        "Reel Making Contest",
        "Attend Festival"
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

    const validateForm = () => {
        // Phone number validation
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
            toast.error("Phone number must be exactly 10 digits");
            return false;
        }

        // Profession-specific validation
        if (formData.profession === 'student') {
            if (!formData.college || !formData.idNumber) {
                toast.error("Please fill in all student details");
                return false;
            }
        } else if (formData.profession === 'working') {
            if (!formData.idType || !formData.idNumber) {
                toast.error("Please fill in all professional details");
                return false;
            }
        }

        // Password confirmation validation
        // if (formData.password !== formData.confirmPassword) {
        //     toast.error("Passwords do not match");
        //     return false;
        // }

        // Required fields validation
        if (!formData.name || !formData.email || !formData.phoneNumber || 
            !formData.profession || !formData.gender || 
            formData.selectedEvents.length === 0) {
            toast.error("Please fill in all required fields");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const loadingToast = toast.loading("Validating registration...");

        try {
            // Prepare registration data
            const registrationData = {
                name: formData.name,
                email: formData.email.toLowerCase(),
                phoneNumber: formData.countryCode + formData.phoneNumber,
                profession: formData.profession,
                idType: formData.profession === 'working' ? formData.idType : null,
                idNumber: formData.idNumber,
                college: formData.profession === 'student' ? formData.college : null,
                gender: formData.gender,
                referralName: formData.referralName || null,
                selectedEvents: formData.selectedEvents
            };

            // Log the data being sent
            console.log('Sending registration data:', registrationData);

            // Validate registration data with API
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData)
            });

            // Log the raw response
            console.log('Raw response:', response);

            let result;
            try {
                result = await response.json();
                console.log('Parsed response:', result);
            } catch (error) {
                console.error('Error parsing response:', error);
                throw new Error('Failed to parse server response');
            }

            if (!response.ok) {
                throw new Error(result.error || 'Validation failed');
            }

            // Store registration data in session storage for payment page
            sessionStorage.setItem('registrationData', JSON.stringify(registrationData));

            toast.dismiss(loadingToast);
            toast.success("Validation successful! Proceeding to payment.");

            // Redirect to payment page
            router.replace('/events/payment');

        } catch (error) {
            console.error('Error during validation:', error);
            toast.dismiss(loadingToast);
            
            const errorMessage = error.message || "Validation failed. Please try again later";
            
            if (errorMessage.includes('already registered') || 
                errorMessage.includes('already exists') ||
                errorMessage.includes('Invalid')) {
                toast.error(errorMessage);
            } else {
                toast.error("Validation failed. Please try again later");
            }
        }
    };

    return (
        <div className="register-page-container">
        <div className="register-page" style={{ backgroundImage: `url(${backgroundImage.src})` }}>
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
                            autoComplete='name'
                        />
                    </div>
                    <div className="form-group">
                        <label>Email: *</label>
                        <input 
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group phone-group">
                        <label>Phone Number: *</label>
                        <div className="phone-input-container">
                            <div className="phone-input-wrapper">
                                <select
                                    value={formData.countryCode}
                                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                                    className="country-code-select"
                                    style={{ flex: '0 0 40%' }}
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
                                    style={{ flex: '0 0 60%' }}
                                    autoComplete='tel'
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Profession: *</label>
                        <select 
                            value={formData.profession}
                            onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                            required
                            autoComplete='profession'
                        >
                            <option value="">Select Profession</option>
                            <option value="student">Student</option>
                            <option value="working">Working Professional</option>
                        </select>
                    </div>

                    {formData.profession === 'student' && (
                        <>
                            <div className="form-group">
                                <label>College: *</label>
                                <input 
                                    type="text"
                                    value={formData.college}
                                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                    placeholder="Enter your college name"
                                    required
                                    autoComplete='college'
                                />
                            </div>
                            <div className="form-group">
                                <label>Student ID Number: *</label>
                                <input 
                                    type="text"
                                    value={formData.idNumber}
                                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                                    placeholder="Enter your student ID"
                                    required
                                    autoComplete='idNumber'
                                />
                            </div>
                        </>
                    )}

                    {formData.profession === 'working' && (
                        <>
                            <div className="form-group">
                                <label>ID Type: *</label>
                                <select 
                                    value={formData.idType}
                                    onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                                    required
                                    autoComplete='idType'
                                >
                                    <option value="">Select ID Type</option>
                                    <option value="aadhar">Aadhar Card</option>
                                    <option value="voter">Voter ID</option>
                                    <option value="pan">PAN Card</option>
                                    <option value="passport">Passport</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Proof Number: *</label>
                                <input 
                                    type="text"
                                    value={formData.idNumber}
                                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                                    placeholder="Enter your ID number"
                                    required
                                    autoComplete='idNumber'
                                />
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label>Gender: *</label>
                        <select 
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            required
                            autoComplete='gender'
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
                            autoComplete='referralName'
                        />
                    </div>

                    <div className="form-group events-section">
                        <label>Selected Events: *</label>
                        <div className="events-container">
                            <div className="events-grid">
                                <div className="events-grid-one">
                                    <button
                                        type="button"
                                        className={`event-button ${formData.selectedEvents.includes('Short Film Contest') ? 'selected' : ''}`}
                                        onClick={() => handleEventSelection('Short Film Contest')}
                                    >
                                        Short Film Contest
                                    </button>
                                    <button
                                        type="button"
                                        className={`event-button ${formData.selectedEvents.includes('Reel Making Contest') ? 'selected' : ''}`}
                                        onClick={() => handleEventSelection('Reel Making Contest')}
                                    >
                                        Reel Making Contest
                                    </button>
                                </div>
                                <div className="events-grid-two">
                                    <button
                                        type="button"
                                        className={`event-button ${formData.selectedEvents.includes('Photography Contest') ? 'selected' : ''}`}
                                        onClick={() => handleEventSelection('Photography Contest')}
                                    >
                                        Photography Contest
                                    </button>
                                    <button
                                        type="button"
                                        className={`event-button ${formData.selectedEvents.includes('Attend Festival') ? 'selected' : ''}`}
                                        onClick={() => handleEventSelection('Attend Festival')}
                                    >
                                        Attend Festival
                                    </button>
                                </div>
                            </div>
                            <div className="select-all-button-container">
                            <button 
                                type="button" 
    
                                className={`select-all-button ${formData.selectedEvents.length === events.length ? 'selected' : ''}`}
                                onClick={() => handleEventSelection('all')}
                            >
                                {formData.selectedEvents.length === events.length ? 'Unselect All' : 'Select All Events'}
                            </button>
                            </div>
                        </div>
                    </div>
    
                    <div className="form-group-register" style={{ textDecoration: "underline" }}>

                        End Date to Register and Submit : 7th January 2025                   
                    </div>
                    <button type="submit" className="submit-button">Next</button>
                </form>
                </div>
            </div>
        </div>
        <Footer />
        </div>
    );
}

export default RegisterPage; 