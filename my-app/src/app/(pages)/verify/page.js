'use client';
import './page.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

export default function VerifyPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            toast.error('Please login to access the verify page');
            router.push('/login');
            return;
        }
    }, [user, router]);

    const fetchRegistrations = async (search = '') => {
        try {
            const queryParams = new URLSearchParams();
            if (search) {
                queryParams.append('search', search);
            }

            const response = await fetch(`/api/verify?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch registrations');
            }

            const data = await response.json();
            setRegistrations(data.registrations);
        } catch (error) {
            console.log('Error fetching registrations:', error);
            toast.error('Failed to fetch registrations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        fetchRegistrations(value);
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

    const handleLogout = async () => {
        const loadingToast = toast.loading('Logging out...');
        try {
            await auth.signOut();
            toast.success('Logged out successfully!', { id: loadingToast });
            router.push('/login');
        } catch (error) {
            console.error('Error logging out:', error);
            toast.error(error.message || 'Error logging out', { id: loadingToast });
        }
    };

    if (loading) {
        return (
            <div className="verify-component">
                <div className="loading">Loading registrations...</div>
            </div>
        );
    }

    if (!user) {
        return <div className="loading">Checking authentication...</div>;
    }

    return (
        <div className="verify-component">
            <Toaster position="top-center" />
            <div className="verify-header">
                <div className="verify-title">
                    <h1>Total Registrations ({registrations.length})</h1>
                    <div className="user-info">
                        Welcome, {user?.email}
                    </div>
                </div>
                <div className="header-actions">
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </div>
            <div className="verify-component-in">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by ID number or phone number..."
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
                        {registrations.map((registration) => (
                            <tr key={registration._id}>
                                <td>{registration.idNumber}</td>
                                <td>{registration.name}</td>
                                <td>{formatPhoneNumber(registration.phoneNumber)}</td>
                                <td>{registration.college || 'N/A'}</td>
                                <td>
                                    <div className={`verify-status ${registration.verified ? 'verified' : 'not-verified'}`}>
                                        {registration.verified ? 'Verified' : 'Not Verified'}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {registrations.length === 0 && (
                            <tr>
                                <td colSpan="5" className="no-results">
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