import './sideBar.css';
import Link from 'next/link';
import { 
    FaChartBar, 
    FaUserCircle, 
    FaCog, 
    FaMoneyBill
} from 'react-icons/fa';

const DashboardSidenav = ({ userName = 'Admin User', userRole = 'Administrator' }) => {
    return (
        <aside className="dashboard-sidenav">
            <div className="dashboard-sidebnav-in">
                <div className="admin-info">
                    <div className="admin-info-in">
                        <h3>{userName}</h3>
                        <span className="user-role">{userRole}</span>
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