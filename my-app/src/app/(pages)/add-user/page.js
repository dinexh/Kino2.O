"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import toast, { Toaster } from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';
import './add-user.css';

export default function AddUser() {
    return (
        <ProtectedRoute allowedRoles={['superuser']}>
            <AddUserContent />
        </ProtectedRoute>
    );
}

function AddUserContent() {
    const router = useRouter();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'user'
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create user');
            }

            toast.success('User created successfully');
            setFormData({
                email: '',
                password: '',
                role: 'user'
            });
        } catch (error) {
            console.error('Error creating user:', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        router.push('/dashboard');
    };

    return (
        <div className="add-user-container">
            <Toaster position="top-center" />
            <div className="add-user-content">
                <div className="add-user-header">
                    <div className="header-content">
                        <h1>Add New User</h1>
                        <p className="user-info">Logged in as: {user?.email}</p>
                    </div>
                    <button onClick={handleBack} className="back-button">
                        <FaArrowLeft /> Back to Dashboard
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="add-user-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter password"
                            minLength={6}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="user">User</option>
                            <option value="superuser">Superuser</option>
                        </select>
                    </div>

                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create User'}
                    </button>
                </form>
            </div>
        </div>
    );
} 