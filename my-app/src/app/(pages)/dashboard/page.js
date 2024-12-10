'use client'
import { useState, useEffect } from 'react'
import Navigation from '../components/navdash/navdash';
import Footer from '../components/footer/footerdash';
import { CSVLink } from 'react-csv'
import './dashboard.css'
import { db } from '../../../firebase/config'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'

export default function Dashboard() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const paymentsRef = collection(db, 'payments')
      const snapshot = await getDocs(paymentsRef)
      const paymentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setPayments(paymentsData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching payments:', error)
      setLoading(false)
    }
  }

  const verifyPayment = async (paymentId) => {
    try {
      const paymentRef = doc(db, 'payments', paymentId)
      await updateDoc(paymentRef, {
        verified: true,
        verifiedAt: new Date().toISOString()
      })
      fetchPayments() // Refresh the payments list
    } catch (error) {
      console.error('Error verifying payment:', error)
    }
  }

  const csvData = payments.map(payment => ({
    ID: payment.id,
    Date: payment.date,
    Amount: payment.amount,
    Status: payment.status,
    Customer: payment.customerName,
    Email: payment.email,
    Phone: payment.phoneNumber,
    VerificationStatus: payment.verified ? 'Verified' : 'Pending'
  }))

  return (
    <div className="dashboard-container">
      <Navigation />
      
      <main className="dashboard-main" style={{ backgroundColor: '#f8f8f8' }}>
        <h1 style={{ borderBottom: '3px solid #FF6B00' }}>Payment Dashboard</h1>
        
        <div className="dashboard-actions">
          <CSVLink 
            data={csvData}
            filename={'payments.csv'}
            className="download-btn"
          >
            Download CSV
          </CSVLink>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Verification</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.id}</td>
                    <td>{payment.date}</td>
                    <td>${payment.amount}</td>
                    <td>{payment.status}</td>
                    <td>{payment.customerName}</td>
                    <td>{payment.email}</td>
                    <td>{payment.phoneNumber}</td>
                    <td>{payment.verified ? 'Verified' : 'Pending'}</td>
                    <td>
                      {!payment.verified && (
                        <button
                          onClick={() => verifyPayment(payment.id)}
                          className="verify-btn"
                        >
                          Verify Payment
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
