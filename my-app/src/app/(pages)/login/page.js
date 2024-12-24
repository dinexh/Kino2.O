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

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Logging in...');
        
        try {
            await login(email, password);
            toast.success('Logged in successfully!', { id: loadingToast });
            router.push('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.message || 'Invalid login credentials', { id: loadingToast });
        }
    };

    // Render loading state or redirect
    if (user) {
        return null; // or a loading spinner
    }

    return (
        <div className="login-container">
            <div className="film-reel-overlay"></div>
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
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <div className="password-input-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
} 