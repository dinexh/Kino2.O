"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth } from '../../../config/firebase';
import { collection, query, orderBy, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Image from 'next/image';
import { useAuth } from '../../../context/AuthContext';
import './dashboard.css';
import toast, { Toaster } from 'react-hot-toast';

const downloadCSV = (data, filename) => {
    // Define CSV headers based on your requirements
    const headers = [
        'SNO',
        'Name',
        'Phone Number',
        'College',
        'Events',
        'Payment Details - Name',
        'Payment Details - Number'
    ];

    // Convert data to CSV format with serial numbers
    const csvData = data.map((item, index) => [
        index + 1, // SNO
        item.name || '',
        `'${item.phoneNumber || ''}'`, // Add quotes to preserve phone number format
        item.college || '',
        (item.selectedEvents || []).join(' | '), // Using | as separator for better readability
        item.paymentMethod || '',
        item.transactionId || ''
    ]);

    // Combine headers and data
    const csvContent = [
        headers,
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
    const [referral, setReferral] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [oldRegistrations, setOldRegistrations] = useState([]);
    const [activeView, setActiveView] = useState('new');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDetails, setSelectedDetails] = useState(null);

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

                const [paymentData, oldRegData, workshopData] = await Promise.all([
                    fetchCollection('newRegistrations'),
                    fetchCollection('registrations', 'registrationDate'),
                    fetchCollection('workshopRegistrations', 'registrationDate')
                ]);

                setPayments(paymentData);
                setOldRegistrations(oldRegData);
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
            return payments.filter(payment => {
                const matchesSearch = 
                    payment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    payment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    payment.phoneNumber?.includes(searchTerm);
                
                const matchesStatus = filterStatus === 'all' || payment.paymentStatus === filterStatus;
                
                return matchesSearch && matchesStatus;
            });
        } else {
            return oldRegistrations.filter(reg => {
                const matchesSearch = 
                    reg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    reg.idNumber?.includes(searchTerm);
                
                return matchesSearch;
            });
        }
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
        totalRegistrations: payments.length + workshopRegistrations.length + oldRegistrations.length,
        pendingPayments: payments.filter(p => p.paymentStatus === 'pending').length,
        verifiedPayments: payments.filter(p => p.paymentStatus === 'verified').length,
        totalWorkshops: workshopRegistrations.length,
        oldRegistrations: oldRegistrations.length
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
            } else {
                setOldRegistrations(oldRegistrations.filter(item => item.id !== id));
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
            } else {
                setOldRegistrations(oldRegistrations.map(item => 
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
                                const dataToDownload = activeView === 'new' ? payments : oldRegistrations;
                                downloadCSV(dataToDownload, filename);
                            }}
                        >
                            Download CSV
                        </button>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
                <div className="header-stats">
                    <div className="stat-card">
                        <h3>Total Registrations</h3>
                        <p>{dashboardStats.totalRegistrations}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Pending Payments</h3>
                        <p>{dashboardStats.pendingPayments}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Revenue Generated</h3>
                        <p>{dashboardStats.totalRegistrations*350}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Verified Payments</h3>
                        <p>{dashboardStats.verifiedPayments}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Old Registrations</h3>
                        <p>{dashboardStats.oldRegistrations}</p>
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
                        className={`toggle-btn ${activeView === 'old' ? 'active' : ''}`}
                        onClick={() => setActiveView('old')}
                    >
                        Old Registrations
                    </button>
                </div>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
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
                                        <div className="college-name">{item.college || 'N/A'}</div>
                                        <div className="referral-name">{item.referralName || 'N/A'}</div>
                                    </div>
                                    <button className="details-btn" onClick={() => openModal(item)}>View Details</button>
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
        </div>
    );
} 