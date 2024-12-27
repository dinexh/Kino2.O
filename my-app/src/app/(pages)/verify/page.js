"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import toast, { Toaster } from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';
import './verify.css';

export default function Verify() {
    return (
        <ProtectedRoute allowedRoles={['user', 'superuser']}>
            <VerifyContent />
        </ProtectedRoute>
    );
}

function VerifyContent() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleDashboardClick = () => {
        router.push('/dashboard');
    };

    const fetchRegistrations = async (search = '') => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/verify?search=${encodeURIComponent(search)}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch registrations');
            }

            const data = await response.json();
            setRegistrations(data.registrations || []);
        } catch (error) {
            console.error('Error fetching registrations:', error);
            setError(error.message);
            toast.error(error.message || 'Failed to fetch registrations');
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

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Error logging out:', error);
            toast.error('Failed to logout');
        }
    };

    return (
        <div className="verify-container">
            <Toaster position="top-center" />
            <div className="verify-content">
                <div className="verify-header">
                    <div className="header-content">
                        <h1>Verification Portal</h1>
                        <p className="user-info">Logged in as: {user?.email}</p>
                    </div>
                    <div className="header-actions">
                        {user?.role === 'superuser' && (
                            <button onClick={handleDashboardClick} className="back-button">
                                <FaArrowLeft /> Dashboard
                            </button>
                        )}
                        <button onClick={handleLogout} className="logout-button">
                            Logout
                        </button>
                    </div>
                </div>

                <div className="search-section">
                    <input
                        type="text"
                        placeholder="Search by ID number or phone number..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="search-input"
                        disabled={loading}
                    />
                </div>

                <div className="registrations-table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID Number</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="loading-cell">
                                        <div className="loading-spinner"></div>
                                        Loading...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="4" className="error-cell">
                                        {error}. Please try again.
                                    </td>
                                </tr>
                            ) : registrations.length > 0 ? (
                                registrations.map((reg) => (
                                    <tr key={reg._id}>
                                        <td>{reg.idNumber}</td>
                                        <td>{reg.name}</td>
                                        <td>{reg.phoneNumber}</td>
                                        <td>
                                            <span className={`status-badge ${reg.paymentStatus}`}>
                                                {reg.paymentStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
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
        </div>
    );
}