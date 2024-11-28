import './navdash.css';
import Image from 'next/image';
import logo from '../../../Assets/newlogo.png';
import { FaSignOutAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const DashboardNav = ({ onLogout }) => { 
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Token from localStorage:', token);
                
                if (!token) {
                    console.log('No token found, redirecting to login');
                    router.replace('/auth/login');
                    return;
                }

                const response = await fetch('/api/auth/user', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include',
                });
                
                console.log('Response status:', response.status);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('User data:', data);
                    setUserRole(data.role || 'User');
                } else {
                    const errorData = await response.json();
                    console.error('Error response:', errorData);
                    
                    if (response.status === 401) {
                        console.log('Unauthorized, clearing token and redirecting');
                        localStorage.removeItem('token');
                        router.replace('/auth/login');
                    }
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        fetchUserRole();
    }, [router]);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                localStorage.clear();
                sessionStorage.clear();
                
                if (onLogout) {
                    onLogout();
                }

                router.replace('/auth/login');
            } else {
                console.error('Logout failed');
                alert('Logout failed. Please try again.');
            }
        } catch (error) {
            console.error('Logout error:', error);
            alert('Network error during logout. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <nav className="dashboard-nav">
            <div className="dashboard-nav-in">
                <div className="dashboard-nav-in-one">
                    <Image 
                        src={logo} 
                        alt="Chitramela Logo" 
                        width={120} 
                        height={50}
                        priority
                    />
                </div>
                <div className="dashboard-nav-in-two">
                    <h2>Chitramela {userRole} Portal</h2>
                </div>
                <div className="dashboard-nav-in-three">
                    {/* <div className="user-role">
                        <span>Role: {userRole}</span>
                    </div> */}
                    <button 
                        className="logout-btn"
                        onClick={handleLogout}
                        disabled={isLoading}
                        aria-label="Logout"
                    >
                        <FaSignOutAlt />
                        <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default DashboardNav; 