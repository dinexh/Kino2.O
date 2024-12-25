"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        // If user is a regular user
        if (user.role === 'user') {
            // Regular users can only access verify page
            if (!allowedRoles.includes('user')) {
                router.push('/verify');
                return;
            }
        }

        // Superusers can access all pages, so no additional checks needed
    }, [user, router, allowedRoles]);

    // Show nothing while checking auth
    if (!user) {
        return null;
    }

    // Allow superusers to access any page
    if (user.role === 'superuser') {
        return children;
    }

    // For regular users, only show content if they have permission
    if (!allowedRoles.includes(user.role)) {
        return null;
    }

    return children;
} 