"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth } from '../../../config/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import { useAuth } from '../../../context/AuthContext';
import './dashboard.css';
import toast, { Toaster } from 'react-hot-toast';

const downloadCSV = (data, filename) => {
    // Define CSV headers based on your data structure
    const headers = [
        'Name',
        'Email',
        'Phone',
        'Events',
        'UTR/ID',
        'Payment Method',
        'Payment Date',
        'Status'
    ];

    // Convert data to CSV format
    const csvData = data.map(item => [
        item.name || '',
        item.email || '',
        item.phoneNumber || '',
        (item.selectedEvents || []).join(', '),
        item.transactionId || '',
        item.paymentMethod || '',
        item.paymentDate || '',
        item.paymentStatus || ''
    ]);

    // Combine headers and data
    const csvContent = [
        headers,
        ...csvData
    ].map(row => row.join(',')).join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
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
    const [oldRegistrations, setOldRegistrations] = useState([]);
    const [activeView, setActiveView] = useState('new');
    const [currentPage, setCurrentPage] = useState(1);

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

                // Fetch new registrations
                const paymentsRef = collection(db, 'newRegistrations');
                const paymentsQuery = query(paymentsRef, orderBy('paymentDate', 'desc'));
                const paymentsSnapshot = await getDocs(paymentsQuery).catch(error => {
                    console.error('Error fetching new registrations:', error);
                    throw new Error('Failed to fetch new registrations');
                });
                
                const paymentData = paymentsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    paymentDate: doc.data().paymentDate?.toDate().toLocaleString() || 'N/A'
                }));
                
                const oldRegRef = collection(db, 'registrations');
                const oldRegQuery = query(oldRegRef, orderBy('registrationDate', 'desc'));
                const oldRegSnapshot = await getDocs(oldRegQuery);
                
                const oldRegData = oldRegSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    registrationDate: doc.data().registrationDate?.toDate().toLocaleString() || 'N/A'
                }));
                
                const workshopsRef = collection(db, 'workshopRegistrations');
                const workshopsQuery = query(workshopsRef, orderBy('registrationDate', 'desc'));
                const workshopsSnapshot = await getDocs(workshopsQuery);
                
                const workshopData = workshopsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    registrationDate: doc.data().registrationDate?.toDate().toLocaleString() || 'N/A'
                }));

                setPayments(paymentData);
                setOldRegistrations(oldRegData);
                setWorkshopRegistrations(workshopData);
                toast.success('Dashboard data loaded successfully!', { id: loadingToast });
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error(error.message || 'Error loading dashboard data', { id: loadingToast });
                
                // If it's an authentication error, redirect to login
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
        setSelectedImage(null);
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
                                    </div>
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
                                        defaultValue={item.paymentStatus}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="verified">Verified</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
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
        </div>
    );
} 