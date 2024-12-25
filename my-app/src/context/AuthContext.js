"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const checkAuth = async () => {
        try {
            console.log('Checking auth for path:', pathname);
            // Only check auth for protected routes
            if (pathname === '/dashboard' || pathname === '/verify') {
                console.log('Protected route detected, checking authentication');
                const response = await fetch('/api/auth/user', {
                    credentials: 'include'
                });

                console.log('Auth check response status:', response.status);
                if (response.ok) {
                    const data = await response.json();
                    console.log('User data received:', data);
                    setUser(data);
                    
                    // Enforce role-based access
                    if (pathname === '/dashboard' && data.role !== 'superuser') {
                        console.log('User not authorized for dashboard, redirecting to verify');
                        router.push('/verify');
                    }
                } else {
                    console.log('Auth check failed, redirecting to login');
                    setUser(null);
                    router.push('/login');
                }
            } else {
                // For non-protected routes, just check if user is logged in
                console.log('Non-protected route, checking if user is logged in');
                const response = await fetch('/api/auth/user', {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log('User is logged in:', data);
                    setUser(data);
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
        checkAuth();
    }, [pathname]);

    const login = async (email, password) => {
        try {
            console.log('Attempting login for:', email);
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            console.log('Login response status:', response.status);
            if (!response.ok) {
                const error = await response.json();
                console.error('Login failed:', error);
                throw new Error(error.error || 'Invalid login credentials');
            }

            const data = await response.json();
            console.log('Login successful:', data);
            setUser(data.user);

            // Redirect based on user role
            if (data.user.role === 'superuser') {
                console.log('Redirecting superuser to dashboard');
                router.push('/dashboard');
            } else {
                console.log('Redirecting user to verify page');
                router.push('/verify');
            }

            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            console.log('Logging out user');
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    const value = {
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
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