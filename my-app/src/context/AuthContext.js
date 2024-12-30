"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const refreshToken = async () => {
        try {
            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                credentials: 'include'
            });

            if (!response.ok) {
                // If refresh fails, just update the user state
                setUser(null);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Token refresh error:', error);
            setUser(null);
            return false;
        }
    };

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth/user', {
                credentials: 'include',
                cache: 'no-store'
            });
            
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                // Try to refresh token if auth check fails
                const refreshed = await refreshToken();
                if (!refreshed) {
                    setUser(null);
                }
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Skip auth check on reset password page
        if (window.location.pathname === '/reset-password') {
            setLoading(false);
            return;
        }

        checkAuth();

        // Set up periodic token refresh (every 9 minutes)
        const refreshInterval = setInterval(refreshToken, 9 * 60 * 1000);

        // Remove auto-logout timeout
        return () => {
            clearInterval(refreshInterval);
        };
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            await checkAuth(); // Refresh auth state after login
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
            
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 