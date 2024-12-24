"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import './dashboard.css';
import toast, { Toaster } from 'react-hot-toast';

const downloadCSV = (data, filename) => {
    // Define CSV headers based on your requirements
    const headers = [
        'Name',
        'Email',
        'Phone',
        'Profession',
        'ID Type',
        'ID Number',
        'College',
        'Gender',
        'Referral Name',
        'Selected Events',
        'Registration Date',
        'Payment Status',
        'Transaction ID',
        'Payment Date',
        'Payment Method'
    ];

    // Convert data to CSV format
    const csvData = data.map(item => {
        return [
            item.name,
            item.email,
            item.phoneNumber,
            item.profession,
            item.idType || '',
            item.idNumber,
            item.college || '',
            item.gender,
            item.referralName || '',
            item.selectedEvents.join('; '),
            new Date(item.registrationDate).toLocaleString(),
            item.paymentStatus,
            item.transactionId,
            new Date(item.paymentDate).toLocaleString(),
            item.paymentMethod
        ].map(field => `"${field}"`).join(',');
    });

    // Add headers to CSV data
    const csv = [headers.join(','), ...csvData].join('\n');

    // Create and download the file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

export default function Dashboard() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [stats, setStats] = useState({
        totalRegistrations: 0,
        pendingPayments: 0,
        verifiedPayments: 0,
        totalReferrals: 0,
        totalAmountCollected: 0
    });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [referralStats, setReferralStats] = useState([]);
    const [showReferralModal, setShowReferralModal] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        fetchDashboardData();
    }, [user, router, currentPage, searchQuery, statusFilter]);

    const fetchDashboardData = async () => {
        try {
            const queryParams = new URLSearchParams({
                page: currentPage,
                limit: 10,
                status: statusFilter,
                search: searchQuery
            });

            const response = await fetch(`/api/dashboard?${queryParams}`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            setRegistrations(data.registrations);
            setStats(data.stats);
            setTotalPages(data.pagination.totalPages);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (registrationId, newStatus) => {
        const loadingToast = toast.loading('Updating status...');
        try {
            const response = await fetch('/api/dashboard', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    registrationId,
                    status: newStatus
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            await fetchDashboardData();
            toast.success('Status updated successfully', { id: loadingToast });
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status', { id: loadingToast });
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Error logging out:', error);
            toast.error('Error logging out');
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
        setShowReferralModal(true);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusFilter = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleDownload = () => {
        if (registrations.length === 0) {
            toast.error('No data to download');
            return;
        }
        downloadCSV(registrations, 'registrations.csv');
    };

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="dashboard-container">
            <Toaster position="top-center" />
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <div className="header-actions">
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>
            </div>

            <div className="stats-container">
                <div className="stat-card">
                    <h3>Total Registrations</h3>
                    <p>{stats.totalRegistrations}</p>
                </div>
                <div className="stat-card">
                    <h3>Pending Payments</h3>
                    <p>{stats.pendingPayments}</p>
                </div>
                <div className="stat-card">
                    <h3>Verified Payments</h3>
                    <p>{stats.verifiedPayments}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Referrals</h3>
                    <p>{stats.totalReferrals}</p>
                </div>
                <div className="stat-card">
                    <h3>Amount Collected</h3>
                    <p>₹{stats.totalAmountCollected}</p>
                </div>
            </div>

            <div className="controls">
                <div className="search-filter">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="search-input"
                    />
                    <select
                        value={statusFilter}
                        onChange={handleStatusFilter}
                        className="status-filter"
                    >
                        <option value="all">All Status</option>
                        <option value="pending_verification">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
                <div className="action-buttons">
                    <button onClick={calculateReferralStats} className="view-referrals-btn">
                        View Referrals
                    </button>
                    <button onClick={handleDownload} className="download-btn">
                        Download CSV
                    </button>
                </div>
            </div>

            <div className="registrations-table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Events</th>
                            <th>Payment Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registrations.map((registration) => (
                            <tr key={registration._id}>
                                <td>{registration.name}</td>
                                <td>{registration.email}</td>
                                <td>{registration.phoneNumber}</td>
                                <td>{registration.selectedEvents.join(', ')}</td>
                                <td>
                                    <span className={`status ${registration.paymentStatus}`}>
                                        {registration.paymentStatus}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        onClick={() => openModal(registration)}
                                        className="view-details-btn"
                                    >
                                        View Details
                                    </button>
                                    <select
                                        value={registration.paymentStatus}
                                        onChange={(e) => handleStatusChange(registration._id, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="pending_verification">Pending</option>
                                        <option value="verified">Verify</option>
                                        <option value="failed">Reject</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>

            {selectedDetails && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Registration Details</h2>
                        <div className="details-grid">
                            <div>
                                <strong>Name:</strong> {selectedDetails.name}
                            </div>
                            <div>
                                <strong>Email:</strong> {selectedDetails.email}
                            </div>
                            <div>
                                <strong>Phone:</strong> {selectedDetails.phoneNumber}
                            </div>
                            <div>
                                <strong>Profession:</strong> {selectedDetails.profession}
                            </div>
                            {selectedDetails.profession === 'student' && (
                                <div>
                                    <strong>College:</strong> {selectedDetails.college}
                                </div>
                            )}
                            <div>
                                <strong>ID Number:</strong> {selectedDetails.idNumber}
                            </div>
                            <div>
                                <strong>Gender:</strong> {selectedDetails.gender}
                            </div>
                            <div>
                                <strong>Events:</strong> {selectedDetails.selectedEvents.join(', ')}
                            </div>
                            <div>
                                <strong>Registration Date:</strong>{' '}
                                {new Date(selectedDetails.registrationDate).toLocaleString()}
                            </div>
                            <div>
                                <strong>Payment Status:</strong> {selectedDetails.paymentStatus}
                            </div>
                            <div>
                                <strong>Transaction ID:</strong> {selectedDetails.transactionId}
                            </div>
                            <div>
                                <strong>Payment Method:</strong> {selectedDetails.paymentMethod}
                            </div>
                            {selectedDetails.referralName && (
                                <div>
                                    <strong>Referred By:</strong> {selectedDetails.referralName}
                                </div>
                            )}
                        </div>
                        <button onClick={() => setSelectedDetails(null)} className="close-btn">
                            Close
                        </button>
                    </div>
                </div>
            )}

            {showReferralModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Referral Statistics</h2>
                        <div className="referral-stats">
                            {referralStats.map(({ name, count }) => (
                                <div key={name} className="referral-item">
                                    <span>{name}</span>
                                    <span>{count} referrals</span>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setShowReferralModal(false)} className="close-btn">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
} 