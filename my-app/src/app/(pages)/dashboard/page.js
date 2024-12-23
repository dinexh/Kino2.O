"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth } from '../../../config/firebase';
import { collection, query, orderBy, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Image from 'next/image';
import { useAuth } from '../../../context/AuthContext';
import './dashboard.css';
import toast, { Toaster } from 'react-hot-toast';
import Footer from '../../../components/Footer';
const styles = `
    .stat-card.clickable {
        cursor: pointer;
        transition: transform 0.2s ease;
    }

    .stat-card.clickable:hover {
        transform: scale(1.02);
        background-color: #f0f0f0;
    }

    .toggle-btn.referral-btn {
        background-color: #2c3e50;
        color: #ffd700;
        margin-left: 10px;
        border: 1px solid #ffd700;
    }

    .toggle-btn.referral-btn:hover {
        background-color: #34495e;
        transform: translateY(-1px);
    }

    .referral-stats-list {
        max-height: 70vh;
        overflow-y: auto;
        padding: 1rem;
    }

    .referral-stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        margin: 0.5rem 0;
        background-color: #f8f9fa;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .referrer-name {
        font-weight: 600;
        color: #2c3e50;
    }

    .referral-count {
        background-color: #e9ecef;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.9rem;
        color: #495057;
    }

    .referral-modal {
        width: 90%;
        max-width: 1200px;
        max-height: 80vh;
        background: #1e1e1e;
        border: 1px solid #333;
    }

    .referral-table-container {
        margin-top: 1rem;
        overflow-x: auto;
        max-height: 60vh;
    }

    .referral-table {
        width: 100%;
        border-collapse: collapse;
        background: #1e1e1e;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }

    .referral-table th,
    .referral-table td {
        padding: 15px 20px;
        text-align: left;
        border-bottom: 1px solid #333;
        color: #fff;
    }

    .referral-table th {
        background-color: #2c3e50;
        color: #ffd700;
        font-weight: 600;
        font-size: 1rem;
    }

    .referral-table tr:hover {
        background-color: #2a2a2a;
    }

    .referral-table tr.rank-1 {
        background-color: rgba(255, 215, 0, 0.1);
    }

    .referral-table tr.rank-2 {
        background-color: rgba(192, 192, 192, 0.1);
    }

    .referral-table tr.rank-3 {
        background-color: rgba(205, 127, 50, 0.1);
    }

    .header-stats {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 1rem;
        padding: 1rem;
    }

    .stat-card {
        background: #1e1e1e;
        border-radius: 8px;
        padding: 1.2rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        border: 1px solid #333;
    }

    .stat-card h3 {
        color: #888;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }

    .stat-card p {
        color: #ffd700;
        font-size: 1.8rem;
        font-weight: 600;
        margin: 0;
    }

    .stat-card.total,
    .stat-card.pending,
    .stat-card.verified,
    .stat-card.collected {
        background: #1e1e1e;
    }

    .college-cell {
        padding: 1rem;
        font-size: 0.9rem;
        color: #fff;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .college-cell:hover {
        white-space: normal;
        word-wrap: break-word;
    }
`;

// Add the style tag to the document
if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
}

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
    const [payments, setPayments] = useState([]);
    const [workshopRegistrations, setWorkshopRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [activeView, setActiveView] = useState('new');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [referralStats, setReferralStats] = useState(null);

    useEffect(() => {
        if (!user) {
            toast.error('Please login to access the dashboard');
            router.push('/login');
            return;
        }
    }, [user, router]);

    useEffect(() => {
        const fetchData = async () => {
            const loadingToast = toast.loading('Loading dashboard data...');
            try {
                if (!user) {
                    throw new Error('User not authenticated');
                }

                const fetchCollection = async (collectionName, orderByField = 'paymentDate') => {
                    const collectionRef = collection(db, collectionName);
                    const q = query(collectionRef, orderBy(orderByField, 'desc'));
                    const snapshot = await getDocs(q);
                    return snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        paymentDate: doc.data()[orderByField]?.toDate().toLocaleString() || 'N/A'
                    }));
                };

                const [paymentData, workshopData] = await Promise.all([
                    fetchCollection('newRegistrations'),
                    fetchCollection('workshopRegistrations', 'registrationDate')
                ]);

                setPayments(paymentData);
                setWorkshopRegistrations(workshopData);
                toast.success('Dashboard data loaded successfully!', { id: loadingToast });
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error(error.message || 'Error loading dashboard data', { id: loadingToast });
                
                if (error.code === 'permission-denied' || error.message === 'User not authenticated') {
                    router.push('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user, router]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!user) {
        return <div className="loading">Checking authentication...</div>;
    }

    const handleLogout = async () => {
        const loadingToast = toast.loading('Logging out...');
        try {
            if (!auth) {
                throw new Error('Auth service not initialized');
            }
            await auth.signOut();
            toast.success('Logged out successfully!', { id: loadingToast });
            router.push('/login');
        } catch (error) {
            console.error('Error logging out:', error);
            toast.error(error.message || 'Error logging out', { id: loadingToast });
        }
    };

    const handleImageClick = (imageSrc) => {
        setSelectedImage(imageSrc);
    };

    const closeModal = () => {
        setSelectedDetails(null);
    };

    const getFilteredData = () => {
        if (activeView === 'new') {
            const filtered = payments.filter(payment => {
                const matchesSearch = 
                    payment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    payment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    payment.phoneNumber?.includes(searchTerm) ||
                    payment.college?.toLowerCase().includes(searchTerm.toLowerCase());
                
                const matchesStatus = 
                    filterStatus === 'all' ? true :
                    filterStatus === 'pending' ? payment.paymentStatus !== 'verified' :
                    payment.paymentStatus === filterStatus;
                
                return matchesSearch && matchesStatus;
            });

            // Sort by payment date in descending order (newest first)
            return filtered.sort((a, b) => {
                const dateA = a.paymentDate ? new Date(a.paymentDate) : new Date(0);
                const dateB = b.paymentDate ? new Date(b.paymentDate) : new Date(0);
                return dateB - dateA;
            });
        }
        return [];
    };

    const itemsPerPage = 10;
    
    const filteredData = getFilteredData();
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const dashboardStats = {
        totalRegistrations: payments.length + workshopRegistrations.length,
        pendingPayments: payments.filter(p => p.paymentStatus !== 'verified').length,
        verifiedPayments: payments.filter(p => p.paymentStatus === 'verified').length,
        totalWorkshops: workshopRegistrations.length,
        totalReferrals: payments.filter(p => p.referralName).length,
        totalAmountCollected: payments.filter(p => p.paymentStatus === 'verified').length * 350
    };

    const calculateReferralStats = () => {
        const referralCounts = payments.reduce((acc, registration) => {
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

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this registration? This action cannot be undone.')) {
            return;
        }

        const loadingToast = toast.loading('Deleting registration...');
        try {
            const collectionRef = activeView === 'new' ? 'newRegistrations' : 'registrations';
            await deleteDoc(doc(db, collectionRef, id));
            
            // Update the local state
            if (activeView === 'new') {
                setPayments(payments.filter(item => item.id !== id));
            }
            
            toast.success('Registration deleted successfully!', { id: loadingToast });
        } catch (error) {
            console.error('Error deleting registration:', error);
            toast.error('Failed to delete registration', { id: loadingToast });
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        const loadingToast = toast.loading('Updating status...');
        try {
            const collectionRef = activeView === 'new' ? 'newRegistrations' : 'registrations';
            await updateDoc(doc(db, collectionRef, id), {
                paymentStatus: newStatus
            });
            
            // Update local state
            if (activeView === 'new') {
                setPayments(payments.map(item => 
                    item.id === id ? { ...item, paymentStatus: newStatus } : item
                ));
            }
            
            toast.success('Status updated successfully!', { id: loadingToast });
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status', { id: loadingToast });
        }
    };

    const openModal = (item) => {
        setSelectedDetails(item);
    };

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
                                const dataToDownload = activeView === 'new' ? payments : [];
                                downloadCSV(dataToDownload, filename);
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
                        <small style={{ color: '#888', fontSize: '0.8rem' }}>
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
                        <div className="progress-bar" style={{
                            width: '100%',
                            height: '4px',
                            backgroundColor: '#333',
                            marginTop: '8px',
                            borderRadius: '2px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${Math.min((dashboardStats.totalRegistrations / 500) * 100, 100)}%`,
                                height: '100%',
                                backgroundColor: '#ffd700',
                                transition: 'width 0.3s ease'
                            }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-controls">
                <div className="view-toggle">
                    <button 
                        className={`toggle-btn ${activeView === 'new' ? 'active' : ''}`}
                        onClick={() => setActiveView('new')}
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
                        {currentData.map((item) => (
                            <tr key={item.id}>
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
                                            <span className="value">{item.paymentDate || 'N/A'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="status-actions">
                                    <select 
                                        className={`status-select ${item.paymentStatus}`}
                                        value={item.paymentStatus}
                                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="verified">Verified</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                    <button 
                                        className="delete-btn"
                                        onClick={() => handleDelete(item.id)}
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
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                    >
                        Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="pagination-btn"
                    >
                        Next
                    </button>
                </div>
            </div>

            {selectedImage && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>×</button>
                        <Image
                            src={selectedImage}
                            alt="Payment Screenshot"
                            width={800}
                            height={800}
                            style={{ 
                                objectFit: 'contain',
                                width: '100%',
                                height: 'auto',
                                maxHeight: '90vh'
                            }}
                        />
                    </div>
                </div>
            )}

            {selectedDetails && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>×</button>
                        <h2>{selectedDetails.name}</h2>
                        <p><strong>Email:</strong> {selectedDetails.email}</p>
                        <p><strong>Phone:</strong> {selectedDetails.phoneNumber}</p>
                        <p><strong>College:</strong> {selectedDetails.college || 'N/A'}</p>
                        <p><strong>Payment Method:</strong> {selectedDetails.paymentMethod || 'N/A'}</p>
                        <p><strong>Payment Date:</strong> {selectedDetails.paymentDate || 'N/A'}</p>
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

            <Footer />
        </div>
    );
} 