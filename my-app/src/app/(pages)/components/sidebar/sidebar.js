import './sidebar.css';
import Link from 'next/link';
import { 
    FaChartBar, 
    FaUserCircle, 
    FaCog, 
    FaMoneyBill
} from 'react-icons/fa';
import { useEffect, useState } from 'react';

const DashboardSidenav = () => {
    const [userData, setUserData] = useState({
        userName: '',
        userRole: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    return;
                }

                const response = await fetch('/api/auth/user', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData({
                        userName: data.name || 'Unknown User',
                        userRole: data.role || 'Unknown Role'
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <aside className="dashboard-sidenav">
            <div className="dashboard-sidebnav-in">
                <div className="admin-info">
                    <div className="admin-info-in">
                        <h3>{userData.userName}</h3>
                        <span className="user-role">{userData.userRole}</span>
                    </div>
                </div>
                <div className="dashboard-sidebnav-menu">
                    <div className="dashboard-sidebav-menu-in">
                        <div className="dashboard-nav-links">
                            <Link href="/" className="dashboard-nav-link">
                                <FaChartBar /> <span>Analytics</span>
                            </Link>
                            <Link href="/auth/dashboard/Options/payment" className="dashboard-nav-link">
                                <FaMoneyBill /> <span>Payments</span>
                            </Link>
                            <Link href="/auth/dashboard/Options/users" className="dashboard-nav-link">
                                <FaUserCircle /> <span>User Management</span>
                            </Link>
                            <Link href="/auth/dashboard/Options/settings" className="dashboard-nav-link">
                                <FaCog /> <span>Settings</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default DashboardSidenav; 