"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import './dashboard.css';
import toast, { Toaster } from 'react-hot-toast';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const downloadCSV = async () => {
    try {
        const loadingToast = toast.loading('Preparing CSV download...');
        
        // Fetch all registrations
        const response = await fetch('/api/dashboard?limit=1000000', {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data for CSV');
        }

        const data = await response.json();
        const allRegistrations = data.registrations;

        if (allRegistrations.length === 0) {
            toast.error('No data to download');
            return;
        }

        // Define CSV headers
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
        const csvData = allRegistrations.map(item => {
            const phoneNumber = item.phoneNumber ? item.phoneNumber.toString().padStart(10, '0') : '';
            const idNumber = item.idNumber ? String(item.idNumber) : '';
            const name = item.name || '';
            const transactionId = item.transactionId ? item.transactionId.toString() : '';

        return [
                name,
                item.email || '',
                `'${phoneNumber}'`,
                item.profession || '',
                item.idType || '',
                `'${idNumber}'`,
                item.college || '',
                item.gender || '',
                item.referralName || '',
                (item.selectedEvents || []).join('; '),
                item.registrationDate ? new Date(item.registrationDate).toLocaleString() : '',
                item.paymentStatus || '',
                `'${transactionId}'`,
                item.paymentDate ? new Date(item.paymentDate).toLocaleString() : '',
                item.paymentMethod || ''
            ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
        });

        // Add headers to CSV data
        const csv = [headers.join(','), ...csvData].join('\n');

        // Create and download the file
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
        link.setAttribute('download', `registrations_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
        
        toast.success('CSV downloaded successfully', { id: loadingToast });
    } catch (error) {
        console.error('Error downloading CSV:', error);
        toast.error('Failed to download CSV');
    }
};

export default function Dashboard() {
    return (
        <ProtectedRoute allowedRoles={['superuser']}>
            <DashboardContent />
        </ProtectedRoute>
    );
}

function DashboardContent() {
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
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [viewMode, setViewMode] = useState('all');
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        role: 'user'
    });
    const [showStatsModal, setShowStatsModal] = useState(false);
    const [analyticsData, setAnalyticsData] = useState({
        dailyRegistrations: [],
        genderDistribution: { male: 0, female: 0 },
        hourlyDistribution: Array(24).fill(0),
        eventPopularity: {}
    });

    useEffect(() => {
        fetchDashboardData();
    }, [currentPage, searchQuery, statusFilter, viewMode]);

    const fetchDashboardData = async () => {
        try {
            // Set status filter based on view mode
            let currentStatus = statusFilter;
            if (viewMode === 'pending_verification') {
                currentStatus = 'pending_verification';
            } else if (viewMode === 'verify') {
                currentStatus = 'verified';
            }

            const queryParams = new URLSearchParams({
                page: currentPage,
                limit: 10,
                status: currentStatus,
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

    const SendMail = async (registration) => {
        const loadingToast = toast.loading('Sending email...');
        try {
            const response = await fetch('/api/dashboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    registrationId: registration._id,
                    action: 'sendEmail'
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to send email');
            }

            toast.success('Email sent successfully', { id: loadingToast });
        } catch (error) {
            console.error('Error sending email:', error);
            toast.error('Failed to send email', { id: loadingToast });
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
                    status: newStatus,
                    action: 'updateStatus'
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update status');
            }

            await fetchDashboardData();
            toast.success('Status updated successfully', { id: loadingToast });
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error(error.message || 'Failed to update status', { id: loadingToast });
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

    const calculateReferralStats = async () => {
        try {
            const response = await fetch('/api/dashboard?limit=1000&getReferrals=true', {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch referral data');
            }

            const data = await response.json();
            const allRegistrations = data.registrations;

            const referralCounts = allRegistrations.reduce((acc, registration) => {
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
        } catch (error) {
            console.error('Error fetching referral stats:', error);
            toast.error('Failed to fetch referral statistics');
        }
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

    const handleVerifyClick = () => {
        router.push('/verify');
    };

    const handleDelete = async (registrationId) => {
        if (!window.confirm('Are you sure you want to delete this registration?')) {
            return;
        }

        const loadingToast = toast.loading('Deleting registration...');
        try {
            const response = await fetch(`/api/dashboard?id=${registrationId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to delete registration');
            }

            await fetchDashboardData();
            toast.success('Registration deleted successfully', { id: loadingToast });
        } catch (error) {
            console.error('Error deleting registration:', error);
            toast.error('Failed to delete registration', { id: loadingToast });
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Adding new user...');
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to add user');
            }

            await fetchDashboardData();
            setShowAddUserModal(false);
            setNewUser({
                email: '',
                password: '',
                role: 'user'
            });
            toast.success('User added successfully', { id: loadingToast });
        } catch (error) {
            console.error('Error adding user:', error);
            toast.error('Failed to add user', { id: loadingToast });
        }
    };

    const handleViewModeChange = (e) => {
        setViewMode(e.target.value);
        setCurrentPage(1);
    };

    const fetchAnalyticsData = async () => {
        try {
            const response = await fetch('/api/dashboard?analytics=true', {
                credentials: 'include',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch analytics data');
            }

            const data = await response.json();
            if (!data.analytics) {
                throw new Error('Invalid analytics data format');
            }
            
            // Ensure all required properties exist with default values
            const analytics = {
                genderDistribution: { male: 0, female: 0, ...data.analytics.genderDistribution },
                dailyRegistrations: data.analytics.dailyRegistrations || [],
                hourlyDistribution: data.analytics.hourlyDistribution || Array(24).fill(0),
                eventPopularity: data.analytics.eventPopularity || {}
            };
            
            setAnalyticsData(analytics);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            toast.error(error.message || 'Failed to fetch analytics data');
            setShowStatsModal(false);
        }
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
                    <button onClick={() => {
                        setShowStatsModal(true);
                        fetchAnalyticsData();
                    }} className="stats-button">
                        View Analytics
                    </button>
                    <div className="action-buttons">
                    <button onClick={() => setShowAddUserModal(true)} className="add-user-btn">
                        Add User
                    </button>
                    <button onClick={calculateReferralStats} className="view-referrals-btn">
                        View Referrals
                    </button>
                    <button onClick={handleDownload} className="download-btn">
                            Download CSV
                        </button>
                    </div>
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
                        value={viewMode}
                        onChange={handleViewModeChange}
                        className="view-mode-filter"
                    >
                        <option value="pending_verification">Pending Verifications</option>

                    
                        <option value="verify">Verified Registrations</option>
                        <option value="all">All Registrations</option>
                    </select>
                </div>
            </div>

            <div className="registrations-table">
                <table>
                    <thead>
                        <tr className="bg-gray-100">
                            <th>S.No</th>
                            <th>Name</th>
                            <th>Email</th>
                            {/* <th>Phone</th> */}
                            <th>Events</th>
                            {/* <th>Transaction ID</th> */}
                            {/* <th>Payment Method</th> */}
                            <th>Referral Name</th>
                            <th>Payment Status</th>
                            <th>Registration Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registrations.map((registration) => (
                            <tr key={registration._id}>
                                <td>{registration.Sno}</td>
                                <td>{registration.name}</td>
                                <td>{registration.email}</td>
                                {/* <td>{registration.phoneNumber}</td> */}
                                <td>{registration.selectedEvents.join(', ')}</td>
                                {/* <td>{registration.transactionId}</td> */}
                                {/* <td>{registration.paymentMethod}</td> */}
                                <td>{registration.referralName}</td>
                                <td>
                                    <span>
                                        {registration.paymentStatus}
                                    </span>
                                </td>
                                <td>{new Date(registration.registrationDate).toLocaleString()}</td>
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
                                        <option value="pending_verification">Pending Verification</option>
                                        <option value="verified">Verified</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                    <button onClick={() => SendMail(registration)}
                                          className="send-mail-btn"
                                    >
                                        Send Mail
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(registration._id)}
                                        className="delete-btn"
                                    >
                                        Delete
                                    </button>
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

            {showAddUserModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add New User</h2>
                        <form onSubmit={handleAddUser}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                        required
                                        className="modal-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Password:</label>
                                    <input
                                        type="password"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                                        required
                                        className="modal-input"
                                    />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="submit-btn">Add User</button>
                                <button type="button" onClick={() => setShowAddUserModal(false)} className="cancel-btn">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showStatsModal && (
                <div className="modal">
                    <div className="modal-content analytics-modal">
                        <h2>Registration Analytics</h2>
                        <div className="analytics-grid">
                            <div className="analytics-card">
                                <h3>Gender Distribution</h3>
                                <div className="chart-container">
                                    <Pie
                                        data={{
                                            labels: ['Male', 'Female'],
                                            datasets: [{
                                                data: [
                                                    analyticsData.genderDistribution.male,
                                                    analyticsData.genderDistribution.female
                                                ],
                                                backgroundColor: [
                                                    'rgba(54, 162, 235, 0.8)',
                                                    'rgba(255, 99, 132, 0.8)'
                                                ]
                                            }]
                                        }}
                                        options={{
                                            plugins: {
                                                legend: {
                                                    position: 'bottom',
                                                    labels: {
                                                        color: '#fff'
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="analytics-card">
                                <h3>Daily Registrations</h3>
                                <div className="chart-container">
                                    <Bar
                                        data={{
                                            labels: analyticsData.dailyRegistrations.map(d => new Date(d.date).toLocaleDateString()),
                                            datasets: [{
                                                label: 'Registrations',
                                                data: analyticsData.dailyRegistrations.map(d => d.count),
                                                backgroundColor: 'rgba(255, 215, 0, 0.5)',
                                                borderColor: 'gold',
                                                borderWidth: 1
                                            }]
                                        }}
                                        options={{
                                            responsive: true,
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    ticks: {
                                                        color: '#fff'
                                                    },
                                                    grid: {
                                                        color: 'rgba(255, 255, 255, 0.1)'
                                                    }
                                                },
                                                x: {
                                                    ticks: {
                                                        color: '#fff'
                                                    },
                                                    grid: {
                                                        color: 'rgba(255, 255, 255, 0.1)'
                                                    }
                                                }
                                            },
                                            plugins: {
                                                legend: {
                                                    labels: {
                                                        color: '#fff'
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="analytics-card">
                                <h3>Hourly Distribution</h3>
                                <div className="chart-container">
                                    <Bar
                                        data={{
                                            labels: Array.from({length: 24}, (_, i) => `${i}:00`),
                                            datasets: [{
                                                label: 'Registrations',
                                                data: analyticsData.hourlyDistribution,
                                                backgroundColor: 'rgba(255, 215, 0, 0.5)',
                                                borderColor: 'gold',
                                                borderWidth: 1
                                            }]
                                        }}
                                        options={{
                                            responsive: true,
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    ticks: {
                                                        color: '#fff'
                                                    },
                                                    grid: {
                                                        color: 'rgba(255, 255, 255, 0.1)'
                                                    }
                                                },
                                                x: {
                                                    ticks: {
                                                        color: '#fff'
                                                    },
                                                    grid: {
                                                        color: 'rgba(255, 255, 255, 0.1)'
                                                    }
                                                }
                                            },
                                            plugins: {
                                                legend: {
                                                    labels: {
                                                        color: '#fff'
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="analytics-card">
                                <h3>Event Popularity</h3>
                                <div className="chart-container">
                                    <Bar
                                        data={{
                                            labels: Object.keys(analyticsData.eventPopularity),
                                            datasets: [{
                                                label: 'Registrations',
                                                data: Object.values(analyticsData.eventPopularity),
                                                backgroundColor: 'rgba(255, 215, 0, 0.5)',
                                                borderColor: 'gold',
                                                borderWidth: 1
                                            }]
                                        }}
                                        options={{
                                            responsive: true,
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    ticks: {
                                                        color: '#fff'
                                                    },
                                                    grid: {
                                                        color: 'rgba(255, 255, 255, 0.1)'
                                                    }
                                                },
                                                x: {
                                                    ticks: {
                                                        color: '#fff',
                                                        maxRotation: 45,
                                                        minRotation: 45
                                                    },
                                                    grid: {
                                                        color: 'rgba(255, 255, 255, 0.1)'
                                                    }
                                                }
                                            },
                                            plugins: {
                                                legend: {
                                                    labels: {
                                                        color: '#fff'
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setShowStatsModal(false)} className="close-btn">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
} 