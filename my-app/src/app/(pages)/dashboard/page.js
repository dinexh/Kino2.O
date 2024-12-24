"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../../../context/AuthContext';
import './dashboard.css';
import toast, { Toaster } from 'react-hot-toast';

const downloadCSV = (data, filename) => {
    // Define CSV headers based on your requirements
    const headers = [
        'SNO',
        'Name',
        'Email',
        'Phone Number',
        'College',
        'Events',
        'Payment Method',
        'Transaction ID/UTR',
        'Payment Status',
        'Payment Date',
        'Amount (₹)',
        'Referral Name'
    ];

    // Convert data to CSV format with serial numbers
    const csvData = data.map((item, index) => {
        // Wrap text fields in quotes and escape existing quotes
        const wrapInQuotes = (text) => {
            if (!text) return '""';
            // Replace any quotes in the text with double quotes (CSV standard for escaping)
            const escaped = String(text).replace(/"/g, '""');
            return `"${escaped}"`;
        };

        // Special handling for phone numbers and transaction IDs
        const formatNumberAsText = (value) => {
            if (!value) return '""';
            // Add a single quote prefix to force Excel to treat it as text
            return `"'${String(value).trim()}"`;
        };

        return [
            index + 1, // SNO
            wrapInQuotes(item.name),
            wrapInQuotes(item.email),
            formatNumberAsText(item.phoneNumber), // Special handling for phone number
            wrapInQuotes(item.college),
            wrapInQuotes((item.selectedEvents || []).join(', ')), // Using comma as separator
            wrapInQuotes(item.paymentMethod),
            formatNumberAsText(item.transactionId), // Special handling for transaction ID
            wrapInQuotes(item.paymentStatus),
            wrapInQuotes(item.paymentDate),
            350, // Fixed amount per registration
            wrapInQuotes(item.referralName)
        ];
    });

    // Combine headers and data
    const csvContent = [
        headers.map(header => `"${header}"`), // Wrap headers in quotes
        ...csvData
    ].map(row => row.join(',')).join('\n');

    // Create blob and download with UTF-8 BOM to help Excel recognize the encoding
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export default function Dashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [referralStats, setReferralStats] = useState(null);
    const [dashboardStats, setDashboardStats] = useState({
        totalRegistrations: 0,
        pendingPayments: 0,
        verifiedPayments: 0,
        totalReferrals: 0,
        totalAmountCollected: 0
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalDocuments: 0
    });

    useEffect(() => {
        if (!user) {
            toast.error('Please login to access the dashboard');
            router.push('/login');
            return;
        }
    }, [user, router]);

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: currentPage,
                limit: 10,
                status: filterStatus !== 'all' ? filterStatus : '',
                search: searchTerm
            });

            const response = await fetch(`/api/dashboard?${queryParams}`);
            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data');
            }

            const data = await response.json();
            setRegistrations(data.registrations);
            setDashboardStats(data.stats);
            setPagination(data.pagination);
            toast.success('Dashboard data loaded successfully!', { id: loadingToast });
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error(error.message || 'Error loading dashboard data', { id: loadingToast });
        } finally {
            setLoading(false);
        }
    }, [currentPage, filterStatus, searchTerm]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this registration? This action cannot be undone.')) {
            return;
        }

        const loadingToast = toast.loading('Deleting registration...');
        try {
            const response = await fetch(`/api/dashboard?id=${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete registration');
            }

            await fetchDashboardData(); // Refresh data
            toast.success('Registration deleted successfully!', { id: loadingToast });
        } catch (error) {
            console.error('Error deleting registration:', error);
            toast.error('Failed to delete registration', { id: loadingToast });
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        const loadingToast = toast.loading('Updating status...');
        try {
            const response = await fetch('/api/dashboard', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    registrationId: id,
                    status: newStatus
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            await fetchDashboardData(); // Refresh data
            toast.success('Status updated successfully!', { id: loadingToast });
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status', { id: loadingToast });
        }
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

    const openModal = (item) => {
        setSelectedDetails(item);
    };

    const calculateReferralStats = () => {
        const referralCounts = registrations.reduce((acc, registration) => {
            if (registration.referralName) {
                acc[registration.referralName] = (acc[registration.referralName] || 0) + 1;
            }
            return acc;
        }, {});

        const stats = Object.entries(referralCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);

        setReferralStats(stats);
    };

    const handleViewReferrals = () => {
        calculateReferralStats();
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!user) {
        return <div className="loading">Checking authentication...</div>;
    }

    return (
        <div className="admin-dashboard">
            <Toaster position="top-center" />
            <div className="dashboard-header">
                <div className="header-top">
                    <div>
                        <h1>Admin Dashboard</h1>
                        <div className="user-info">
                            Welcome, {user?.email}
                        </div>
                    </div>
                    <div className="header-actions">
                        <button 
                            className="download-btn" 
                            onClick={() => {
                                const filename = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
                                downloadCSV(registrations, filename);
                            }}
                        >
                            Download CSV
                        </button>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
                <div className="header-stats">
                    <div className="stat-card total">
                        <h3>Total Registrations</h3>
                        <p>{dashboardStats.totalRegistrations}</p>
                        <small className="target-percentage">
                            {((dashboardStats.totalRegistrations / 500) * 100).toFixed(1)}% of target
                        </small>
                    </div>
                    <div className="stat-card pending">
                        <h3>Pending Verification</h3>
                        <p>{dashboardStats.pendingPayments}</p>
                    </div>
                    <div className="stat-card verified">
                        <h3>Verified Registrations</h3>
                        <p>{dashboardStats.verifiedPayments}</p>
                    </div>
                    <div className="stat-card collected">
                        <h3>Amount Collected</h3>
                        <p>₹{dashboardStats.totalAmountCollected}</p>
                    </div>
                    <div className="stat-card target">
                        <h3>Target Progress</h3>
                        <p>{dashboardStats.totalRegistrations}/500</p>
                        <div className="progress-bar">
                            <div 
                                className="progress-bar-fill"
                                style={{
                                    width: `${Math.min((dashboardStats.totalRegistrations / 500) * 100, 100)}%`
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-controls">
                <div className="view-toggle">
                    <button 
                        className="toggle-btn active"
                    >
                        New Registrations
                    </button>
                    <button 
                        className="toggle-btn referral-btn"
                        onClick={handleViewReferrals}
                    >
                        View Referrals ({dashboardStats.totalReferrals})
                    </button>
                </div>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by name, email, phone, or college..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-controls">
                    <select 
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="registrations-table">
                <table>
                    <thead>
                        <tr>
                            <th>Name & Contact</th>
                            <th>College</th>
                            <th>Events</th>
                            <th>Payment Details</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registrations.map((item) => (
                            <tr key={item._id}>
                                <td className="contact-details">
                                    <div className="user-name">{item.name}</div>
                                    <div className="contact-info">
                                        <div>{item.phoneNumber}</div>
                                        <div>{item.email}</div>
                                        <div className="referral-name">{item.referralName || 'N/A'}</div>
                                    </div>
                                    <button className="details-btn" onClick={() => openModal(item)}>View Details</button>
                                </td>
                                <td className="college-cell">
                                    {item.college || 'N/A'}
                                </td>
                                <td className="events-cell">
                                    <div className="events-list">
                                        {item.selectedEvents?.map((event, idx) => (
                                            <span key={idx} className="event-badge">{event}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="payment-details">
                                    <div className="payment-info-grid">
                                        <div className="payment-info-item">
                                            <span className="label">UTR/ID:</span>
                                            <span className="value">{item.transactionId || 'N/A'}</span>
                                        </div>
                                        <div className="payment-info-item">
                                            <span className="label">Method:</span>
                                            <span className="value">{item.paymentMethod || 'Not specified'}</span>
                                        </div>
                                        <div className="payment-info-item">
                                            <span className="label">Date:</span>
                                            <span className="value">
                                                {new Date(item.paymentDate).toLocaleString() || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="status-actions">
                                    <select 
                                        className={`status-select ${item.paymentStatus}`}
                                        value={item.paymentStatus}
                                        onChange={(e) => handleStatusChange(item._id, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="verified">Verified</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                    <button 
                                        className="delete-btn"
                                        onClick={() => handleDelete(item._id)}
                                        aria-label="Delete registration"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="pagination">
                    <button 
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                        className="pagination-btn"
                    >
                        Previous
                    </button>
                    
                    {[...Array(pagination.totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    
                    <button 
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                        className="pagination-btn"
                    >
                        Next
                    </button>
                </div>
            </div>

            {selectedImage && (
                <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedImage(null)}>×</button>
                        <Image
                            src={selectedImage}
                            alt="Payment Screenshot"
                            width={800}
                            height={800}
                            className="modal-image"
                        />
                    </div>
                </div>
            )}

            {selectedDetails && (
                <div className="modal-overlay" onClick={() => setSelectedDetails(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedDetails(null)}>×</button>
                        <h2>{selectedDetails.name}</h2>
                        <p><strong>Email:</strong> {selectedDetails.email}</p>
                        <p><strong>Phone:</strong> {selectedDetails.phoneNumber}</p>
                        <p><strong>College:</strong> {selectedDetails.college || 'N/A'}</p>
                        <p><strong>Payment Method:</strong> {selectedDetails.paymentMethod || 'N/A'}</p>
                        <p><strong>Payment Date:</strong> {new Date(selectedDetails.paymentDate).toLocaleString() || 'N/A'}</p>
                        <p><strong>Status:</strong> {selectedDetails.paymentStatus || 'N/A'}</p>
                        <p><strong>Selected Events:</strong> {selectedDetails.selectedEvents?.join(', ') || 'N/A'}</p>
                    </div>
                </div>
            )}

            {referralStats && (
                <div className="modal-overlay" onClick={() => setReferralStats(null)}>
                    <div className="modal-content referral-modal" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setReferralStats(null)}>×</button>
                        <h2>Referral Statistics</h2>
                        <div className="referral-table-container">
                            <table className="referral-table">
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Name</th>
                                        <th>Referrals</th>
                                        <th>Amount Generated</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {referralStats.map((stat, index) => (
                                        <tr key={index} className={index < 3 ? `rank-${index + 1}` : ''}>
                                            <td>{index + 1}</td>
                                            <td>{stat.name}</td>
                                            <td>{stat.count}</td>
                                            <td>₹{stat.count * 350}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 