"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import logo from '../../Assets/newlogo.png';
import './login.css';
import { useAuth } from '../../../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
    const router = useRouter();
    const { user, login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            const redirectPath = user.role === 'user' ? '/verify' : '/dashboard';
            router.replace(redirectPath);
        }
    }, [user, router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const loadingToast = toast.loading('Logging in...');
        
        try {
            if (!email || !password) {
                throw new Error('Please fill in all fields');
            }

            const result = await login(email, password);
            toast.success('Logged in successfully!', { id: loadingToast });

            // Immediate redirect based on role
            const redirectPath = result.user.role === 'user' ? '/verify' : '/dashboard';
            router.replace(redirectPath);

        } catch (error) {
            console.error('Login error:', error);
            toast.error(
                error.response?.data?.message || 
                error.message || 
                'Login failed. Please check your credentials.',
                { id: loadingToast }
            );
            setIsLoading(false);
        }
    };

    // Remove the film-reel-overlay div since we're not using it
    return (
        <div className="login-container">
            <Toaster position="top-center" />
            <div className="login-form">
                <div className="logo-container">
                    <Image
                        src={logo}
                        alt="Chitramela Logo"
                        width={200}
                        height={80}
                        priority
                    />
                </div>
                <h1>Admin Login</h1>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.trim())}
                        required
                        disabled={isLoading}
                    />
                    <div className="password-input-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
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
                    <button 
                        type="submit" 
                        disabled={isLoading || !email || !password}
                        className={!email || !password ? 'disabled-btn' : ''}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
} 