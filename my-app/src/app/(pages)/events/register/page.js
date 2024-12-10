"use client";
import React, { useState } from 'react';
import Footer from '../../../components/Footer/Footer';
import backgroundImage from '../../../Assets/register3.webp';
import './register.css';
import { useRouter } from 'next/navigation';
import { db } from '../../../../config/firebase';
import { collection, addDoc, getDocs, query, where, serverTimestamp, limit } from 'firebase/firestore';
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

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
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

        const loadingToast = toast.loading("Processing registration...");

        try {
            // Simplified connection test
            const registrationsRef = collection(db, 'registrations');
            
            // Check if email already exists
            try {
                const emailQuery = query(registrationsRef, where('email', '==', formData.email));
                const emailSnapshot = await getDocs(emailQuery);
                
                if (!emailSnapshot.empty) {
                    toast.dismiss(loadingToast);
                    toast.error("This email is already registered");
                    return;
                }

                // Check if ID number already exists
                const idQuery = query(registrationsRef, where('idNumber', '==', formData.idNumber));
                const idSnapshot = await getDocs(idQuery);
                
                if (!idSnapshot.empty) {
                    toast.dismiss(loadingToast);
                    toast.error("This ID number is already registered");
                    return;
                }
            } catch (queryError) {
                console.error('Error checking existing registrations:', queryError);
                toast.dismiss(loadingToast);
                toast.error("Unable to verify registration details. Please try again.");
                return;
            }

            // Create registration document
            try {
                await addDoc(registrationsRef, {
                    name: formData.name,
                    email: formData.email,
                    phoneNumber: formData.countryCode + formData.phoneNumber,
                    profession: formData.profession,
                    idType: formData.profession === 'working' ? formData.idType : null,
                    idNumber: formData.idNumber,
                    college: formData.profession === 'student' ? formData.college : null,
                    gender: formData.gender,
                    referralName: formData.referralName || null,
                    selectedEvents: formData.selectedEvents,
                    registrationDate: serverTimestamp(),
                    paymentStatus: 'pending'
                });

                toast.dismiss(loadingToast);
                toast.success("Registration successful!");
                
                setTimeout(() => {
                    router.push('/events/coming');
                }, 1000);
            } catch (saveError) {
                console.error('Error saving registration:', saveError);
                toast.dismiss(loadingToast);
                toast.error("Failed to save registration. Please try again.");
            }

        } catch (error) {
            console.error('Error during registration:', error);
            toast.dismiss(loadingToast);
            
            if (error.code === 'permission-denied') {
                toast.error("Permission denied. Please check your connection and try again.");
            } else if (error.code === 'unavailable' || error.code === 'not-found') {
                toast.error("Service temporarily unavailable. Please try again later.");
            } else {
                toast.error("Registration failed. Please try again later.");
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
    
                    <div className="form-group" style={{ textDecoration: "underline" }}>

                        End Date to Register and Submit : 30th December 2024                   
                    </div>

                    {/* <div className="form-group password-group">
                        <label>Create Password: *</label>
                        <div className="password-input-container">
                            <input 
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Enter your password"
                                required
                            />
                            <button 
                                type="button" 
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <div className="form-group password-group">
                        <label>Confirm Password: *</label>
                        <div className="password-input-container">
                            <input 
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                placeholder="Confirm your password"
                                required
                            />
                            <button 
                                type="button" 
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div> */}

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