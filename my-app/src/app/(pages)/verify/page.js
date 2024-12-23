'use client';
import './page.css';
import { useState, useEffect } from 'react';
import { db } from '../../../config/firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';

export default function VerifyPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'newRegistrations'), (snapshot) => {
            const registrationData = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    phoneNumber: data.phoneNumber || data.phone
                };
            });
            setRegistrations(registrationData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching registrations:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const formatPhoneNumber = (phone) => {
        if (!phone) return '';
        const cleaned = phone.toString().replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
        }
        return phone;
    };

    const filteredRegistrations = registrations.filter(reg => {
        const searchLower = searchQuery.toLowerCase();
        const phoneSearch = searchQuery.replace(/\D/g, '');
        
        return (
            reg.name?.toLowerCase().includes(searchLower) ||
            reg.idNumber?.toLowerCase().includes(searchLower) ||
            (reg.phoneNumber?.toString() || '').replace(/\D/g, '').includes(phoneSearch)
        );
    });

    const handleVerifyToggle = async (id) => {
        try {
            const registrationRef = doc(db, 'newRegistrations', id);
            const registration = registrations.find(reg => reg.id === id);
            await updateDoc(registrationRef, {
                verified: !registration.verified
            });
        } catch (error) {
            console.error("Error updating verification status:", error);
        }
    };

    if (loading) {
        return (
            <div className="verify-component">
                <div className="loading">Loading registrations...</div>
            </div>
        );
    }

    return (
        <div className="verify-component">
            <div className="verify-component-in">
                <h1>Total Registrations ({registrations.length})</h1>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by ID number, name or phone number..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="search-input"
                    />
                </div>
            </div>
            <div className="verify-component-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID Number</th>
                            <th>Name</th>
                            <th>Phone Number</th>
                            <th>College</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRegistrations.map((registration) => (
                            <tr key={registration.id}>
                                <td>{registration.idNumber}</td>
                                <td>{registration.name}</td>
                                <td>{formatPhoneNumber(registration.phoneNumber)}</td>
                                <td>{registration.college || 'N/A'}</td>
                                <td>
                                    <button
                                        className={`verify-button ${registration.verified ? 'verified' : 'not-verified'}`}
                                        onClick={() => handleVerifyToggle(registration.id)}
                                    >
                                        {registration.verified ? 'Verified' : 'Not Verified'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredRegistrations.length === 0 && (
                            <tr>
                                <td colSpan="4" className="no-results">
                                    No registrations found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}