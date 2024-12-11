"use client";
import { useState, useEffect } from 'react';
import { db, auth } from '@/config/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import './dashboard.css';

const Dashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('cards'); // 'cards' or 'table'
  const router = useRouter();

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const registrationsRef = collection(db, 'newRegistrations');
      const snapshot = await getDocs(registrationsRef);
      const registrationsData = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Registration data:', data);
        
        return {
          id: doc.id,
          ...data,
          phone: data.phone || data.phoneNumber || data.mobile || data.mobileNumber || 'N/A'
        };
      });
      setRegistrations(registrationsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      setLoading(false);
    }
  };

  const updateStatus = async (registrationId, field, newStatus) => {
    try {
      const registrationRef = doc(db, 'newRegistrations', registrationId);
      await updateDoc(registrationRef, {
        [field]: newStatus
      });
      
      // Update local state
      setRegistrations(prevRegistrations => 
        prevRegistrations.map(reg => 
          reg.id === registrationId ? { ...reg, [field]: newStatus } : reg
        )
      );
      
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/auth/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const downloadCSV = () => {
    const formatDate = (timestamp) => {
      if (!timestamp) return '';
      return new Date(timestamp.toDate()).toLocaleDateString();
    };

    // Updated headers to include payment information
    const headers = [
      'Registration ID',
      'Name',
      'Email',
      'Phone',
      'Registration Date',
      'Payment Method',
      'Transaction ID',
      'Payment Status',
      'Registration Status'
    ];

    // Updated data mapping to include payment information
    const csvData = registrations.map(reg => [
      reg.id || '',
      reg.name || '',
      reg.email || '',
      reg.phone || '',
      formatDate(reg.timestamp),
      reg.paymentMethod || 'Not specified',
      reg.transactionId || 'Not available',
      reg.paymentStatus || 'Pending',
      reg.status || 'Pending'
    ]);

    csvData.unshift(headers);

    const csvString = csvData
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `registrations_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const TableView = () => (
    <div className="table-container">
      <table className="registrations-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Payment Method</th>
            <th>Transaction ID</th>
            <th>Payment Status</th>
            <th>Registration Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((reg) => (
            <tr key={reg.id}>
              <td>{reg.id.slice(0, 8)}...</td>
              <td>{reg.name}</td>
              <td>{reg.email}</td>
              <td>{reg.phone !== 'N/A' ? reg.phone : 'No phone number'}</td>
              <td>{new Date(reg.timestamp?.toDate()).toLocaleDateString()}</td>
              <td>{reg.paymentMethod || 'Not specified'}</td>
              <td>{reg.transactionId || 'N/A'}</td>
              <td>
                <select
                  value={reg.paymentStatus || 'pending'}
                  onChange={(e) => updateStatus(reg.id, 'paymentStatus', e.target.value)}
                  className={`status-select status-${reg.paymentStatus?.toLowerCase() || 'pending'}`}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
              </td>
              <td>
                <select
                  value={reg.status || 'pending'}
                  onChange={(e) => updateStatus(reg.id, 'status', e.target.value)}
                  className={`status-select status-${reg.status?.toLowerCase() || 'pending'}`}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </td>
              <td>
                <button 
                  className="view-details-btn"
                  onClick={() => setView('cards')}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div className="dashboard-actions">
            <button 
              onClick={() => setView(view === 'cards' ? 'table' : 'cards')} 
              className="view-toggle-btn"
            >
              {view === 'cards' ? 'Table View' : 'Card View'}
            </button>
            <button onClick={downloadCSV} className="download-btn">
              Download CSV
            </button>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </header>
        
        <div className="dashboard-content">
          <h2>Registrations</h2>
          {loading ? (
            <div className="loading">Loading registrations...</div>
          ) : registrations.length === 0 ? (
            <div className="empty-state">
              <h3>No registrations found</h3>
              <p>New registrations will appear here</p>
            </div>
          ) : view === 'table' ? (
            <TableView />
          ) : (
            <div className="registrations-grid">
              {registrations.map((reg) => (
                <div key={reg.id} className="registration-card">
                  <h3>{reg.name}</h3>
                  <div className="registration-id">
                    ID: {reg.id.slice(0, 8)}...
                  </div>
                  <p>
                    <span>📧</span>
                    {reg.email}
                  </p>
                  <p>
                    <span>📱</span>
                    {reg.phone !== 'N/A' ? reg.phone : 'No phone number'}
                  </p>
                  <p>
                    <span>📅</span>
                    {new Date(reg.timestamp?.toDate()).toLocaleDateString()}
                  </p>
                  <div className="payment-info">
                    <p>
                      <span>💳</span>
                      Payment: {reg.paymentMethod || 'Not specified'}
                    </p>
                    {reg.transactionId && (
                      <p>
                        <span>🔖</span>
                        Transaction ID: {reg.transactionId}
                      </p>
                    )}
                    <p>
                      <span className={`status status-${reg.paymentStatus?.toLowerCase() || 'pending'}`}>
                        Payment: {reg.paymentStatus || 'Pending'}
                      </span>
                    </p>
                  </div>
                  <p>
                    <span className={`status status-${reg.status?.toLowerCase() || 'pending'}`}>
                      Registration: {reg.status || 'Pending'}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard; 