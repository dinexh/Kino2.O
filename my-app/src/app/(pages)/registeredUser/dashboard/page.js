'use client';

export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { db } from '../../../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import './page.css';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let userId;
    try {
      userId = localStorage.getItem('userId');
    } catch (error) {
      console.error('localStorage is not available:', error);
      return;
    }

    if (!userId) {
      router.push('/auth/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        
        if (userDoc.exists()) {
          const firebaseData = userDoc.data();
          
          const eventDate = new Date(firebaseData.eventDate);
          const today = new Date();
          const timeLeft = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

          setUserData({
            name: firebaseData.name,
            ticketStatus: firebaseData.ticketStatus || 'Pending',
            ticketId: firebaseData.paymentId,
            eventDate: firebaseData.eventDate || 'TBA',
            timeLeft: `${timeLeft} days`,
            schedule: [
              {
                time: "09:00 AM",
                title: "Registration & Check-in",
                location: "Main Hall Entrance"
              },
              {
                time: "10:00 AM",
                title: "Opening Ceremony",
                location: "Main Auditorium"
              },
              {
                time: "12:00 PM",
                title: "Lunch Break",
                location: "Dining Area"
              }
            ]
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
        router.push('/auth/login');
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="dashboard-container">
        <div className="error">Error loading dashboard data</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-container-in">
        <div className="dashboard-container-in-heading">
          <div className="dashboard-header">
            <h1>Welcome back, {userData.name}!</h1>
          </div>
        </div>
        
        <div className="stats-grid">
          <div className="stats-grid-in">
            <div className="stats-grid-in-cards">
              <div className="stat-card">
                <div className="stat-icon">🎫</div>
                <h3>Ticket Status</h3>
                <p>{userData.ticketStatus}</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🆔</div>
                <h3>Ticket ID</h3>
                <p>{userData.ticketId}</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <h3>Event Date</h3>
                <p>{userData.eventDate}</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏰</div>
                <h3>Time Left</h3>
                <p>{userData.timeLeft}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-content">
          <div className="dashboard-content-in">
            <div className="upcoming-events">
              <h2>Event Schedule</h2>
              <div className="event-timeline">
                {userData.schedule.map((event, index) => (
                  <div key={index} className="timeline-item">
                    <div className="time">{event.time}</div>
                    <div className="event-details">
                      <h4>{event.title}</h4>
                      <p>{event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
