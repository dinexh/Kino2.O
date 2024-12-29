"use client";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import logo from '../Assets/newlogo.png';
import './reset-password.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isTokenValid, setIsTokenValid] = useState(false);

    const token = searchParams.get('token');
    const baseUrl = 'https://chitramela.in';

    useEffect(() => {
        if (!token) {
            toast.error('Invalid reset link');
            router.push('/login');
            return;
        }

        // Verify token validity
        const verifyToken = async () => {
            try {
                console.log('Verifying token:', token);
                const response = await fetch(`${baseUrl}/api/auth/verify-reset-token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();
                console.log('Token verification response:', data);

                if (!response.ok) {
                    throw new Error(data.error || 'Invalid or expired reset link');
                }

                setIsTokenValid(true);
                toast.success('Link verified successfully');
            } catch (error) {
                console.error('Token verification error:', error);
                toast.error(error.message);
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        };

        verifyToken();
    }, [token, router, baseUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);
        const loadingToast = toast.loading('Resetting password...');

        try {
            console.log('Submitting password reset');
            const response = await fetch(`${baseUrl}/api/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();
            console.log('Password reset response:', data);

            if (!response.ok) {
                throw new Error(data.error || 'Failed to reset password');
            }

            toast.success('Password reset successful!', { id: loadingToast });
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (error) {
            console.error('Reset password error:', error);
            toast.error(error.message || 'Failed to reset password', { id: loadingToast });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isTokenValid) {
        return (
            <div className="reset-password-container">
                <div className="reset-password-form">
                    <div className="logo-container">
                        <Image
                            src={logo}
                            alt="Chitramela Logo"
                            width={200}
                            height={80}
                            priority
                        />
                    </div>
                    <h1>Verifying Reset Link...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="reset-password-container">
            <Toaster position="top-center" />
            <div className="reset-password-form">
                <div className="logo-container">
                    <Image
                        src={logo}
                        alt="Chitramela Logo"
                        width={200}
                        height={80}
                        priority
                    />
                </div>
                <h1>Reset Password</h1>
                <form onSubmit={handleSubmit}>
                    <div className="password-input-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            minLength={6}
                        />
                        <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <div className="password-input-container">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            minLength={6}
                        />
                        <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            disabled={isLoading}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading || !password || !confirmPassword}
                        className={!password || !confirmPassword ? 'disabled-btn' : ''}
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => router.push('/login')}
                        className="back-to-login"
                    >
                        Back to Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function ResetPassword() {
    return (
        <Suspense fallback={
            <div className="reset-password-container">
                <div className="reset-password-form">
                    <div className="logo-container">
                        <Image
                            src={logo}
                            alt="Chitramela Logo"
                            width={200}
                            height={80}
                            priority
                        />
                    </div>
                    <h1>Loading...</h1>
                </div>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
} 