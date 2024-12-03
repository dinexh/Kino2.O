"use client";
import "./userdash.css";
// imports starts here
import DashboardFooter from "../../components/footer/footerdash";
import DashboardNav from "../../components/navdash/navdash";
import { FaCalendar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import './userdash.css';

const UserDashboard = () => {
    // Dummy data - replace with actual data from your backend
    const registeredEvents = [
        {
            id: 1,
            title: "Tech Conference 2024",
            date: "2024-04-15",
            time: "09:00 AM",
            location: "Convention Center",
            status: "upcoming",
            image: "/images/tech-conf.jpg"
        },
        {
            id: 2,
            title: "Startup Meetup",
            date: "2024-04-20",
            time: "02:00 PM",
            location: "Innovation Hub",
            status: "upcoming",
            image: "/images/startup-meetup.jpg"
        }
    ];

    return ( 
        <div className="UserDashboard">
            <div className="UserDashboard-in">
                <div className="UserDashboard-nav">
                    <DashboardNav />
                </div>
                
                <main className="dashboard-main">
                    <h1 className="dashboard-title">My Events</h1>
                    
                    <div className="dashboard-stats">
                        <div className="stat-card">
                            <h3>Total Events</h3>
                            <p>{registeredEvents.length}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Upcoming</h3>
                            <p>{registeredEvents.filter(event => event.status === 'upcoming').length}</p>
                        </div>
                    </div>

                    <div className="events-grid">
                        {registeredEvents.map(event => (
                            <div key={event.id} className="event-card">
                                <div className="event-image">
                                    <img src={event.image} alt={event.title} />
                                </div>
                                <div className="event-details">
                                    <h2>{event.title}</h2>
                                    <div className="event-info">
                                        <p><FaCalendar /> {event.date}</p>
                                        <p><FaClock /> {event.time}</p>
                                        <p><FaMapMarkerAlt /> {event.location}</p>
                                    </div>
                                    <button className="view-details-btn">View Details</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                <div className="UserDashboard-footer">
                    <DashboardFooter />
                </div>
            </div>
        </div>
    );
}
 
export default UserDashboard;