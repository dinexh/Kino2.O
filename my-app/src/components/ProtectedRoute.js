"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            // For dashboard, only allow superusers
            if (window.location.pathname === '/dashboard' && user.role !== 'superuser') {
                router.push('/verify');
                return;
            }
        }
    }, [user, loading, router]);

    // Show nothing while checking auth
    if (loading) {
        return null;
    }

    // For regular users, only allow verify page
    if (user && user.role === 'user' && !allowedRoles.includes('user')) {
        return null;
    }

    return children;
} 