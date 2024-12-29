"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import logo from '../../Assets/newlogo.png';
import './forgot-password.css';

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const loadingToast = toast.loading('Checking email...');

        try {
            console.log('Submitting email:', email);
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            console.log('Server response:', { status: response.status, data });

            if (response.status === 404) {
                // User not found
                toast.error('No account found with this email address', { id: loadingToast });
                return;
            }

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send reset link');
            }

            if (data.userExists) {
                toast.success('Reset link sent to your email!', { id: loadingToast });
                // Wait a bit before redirecting to let user see the success message
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                // This shouldn't happen given the 404 check above, but just in case
                toast.error('No account found with this email address', { id: loadingToast });
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            toast.error(error.message || 'Failed to send reset link', { id: loadingToast });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <Toaster position="top-center" />
            <div className="forgot-password-form">
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
                <p>Enter your email address to receive a password reset link.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.trim())}
                        required
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading || !email}
                        className={!email ? 'disabled-btn' : ''}
                    >
                        {isLoading ? 'Processing...' : 'Send Reset Link'}
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