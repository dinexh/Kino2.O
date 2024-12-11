"use client";
import React, { useEffect, useState } from 'react';
import { db } from '../../../config/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import './dashboard.css';

export default function Dashboard() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const paymentsRef = collection(db, 'newRegistrations');
                const q = query(paymentsRef, orderBy('paymentDate', 'desc'));
                const querySnapshot = await getDocs(q);
                
                const paymentData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    paymentDate: doc.data().paymentDate?.toDate().toLocaleString() || 'N/A'
                }));
                
                setPayments(paymentData);
            } catch (error) {
                console.error('Error fetching payments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const handleImageClick = (imageSrc) => {
        setSelectedImage(imageSrc);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    const filteredPayments = payments.filter(payment => {
        const matchesSearch = 
            payment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.phoneNumber?.includes(searchTerm);
        
        const matchesStatus = filterStatus === 'all' || payment.paymentStatus === filterStatus;
        
        return matchesSearch && matchesStatus;
    });

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <div className="header-top">
                    <h1>Admin Dashboard</h1>
                    <div className="header-actions">
                        <button className="download-btn">Download CSV</button>
                        <button className="logout-btn">Logout</button>
                    </div>
                </div>
                <div className="header-stats">
                    <div className="stat-card">
                        <h3>Total Registrations</h3>
                        <p>{payments.length}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Pending Payments</h3>
                        <p>{payments.filter(p => p.paymentStatus === 'pending').length}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Verified Payments</h3>
                        <p>{payments.filter(p => p.paymentStatus === 'verified').length}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Amount</h3>
                        <p>₹{payments.length * 360}</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-controls">
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
                            <th>Registration Details</th>
                            <th>Contact Info</th>
                            <th>Events & Payment</th>
                            <th>Status & Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayments.map((payment) => (
                            <tr key={payment.id}>
                                <td className="registration-details">
                                    <div className="user-name">{payment.name}</div>
                                    <div className="registration-id">ID: {payment.id.substring(0, 8)}...</div>
                                    <div className="registration-date">
                                        Registered: {payment.paymentDate}
                                    </div>
                                </td>
                                <td className="contact-info">
                                    <div>{payment.email}</div>
                                    <div>{payment.phoneNumber}</div>
                                    <div>{payment.profession}</div>
                                </td>
                                <td className="events-payment">
                                    <div className="events-list">
                                        {payment.selectedEvents?.map((event, idx) => (
                                            <span key={idx} className="event-badge">{event}</span>
                                        ))}
                                    </div>
                                    <div className="payment-info">
                                        <div>Method: {payment.paymentMethod || 'Not specified'}</div>
                                        <div>Transaction ID: {payment.transactionId || 'N/A'}</div>
                                        {payment.paymentScreenshot && (
                                            <button 
                                                className="view-receipt"
                                                onClick={() => handleImageClick(payment.paymentScreenshot)}
                                            >
                                                View Receipt
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td className="status-actions">
                                    <select 
                                        className={`status-select ${payment.paymentStatus}`}
                                        defaultValue={payment.paymentStatus}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="verified">Verified</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                    <div className="action-buttons">
                                        <button className="edit-btn">Edit</button>
                                        <button className="delete-btn">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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