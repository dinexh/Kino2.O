"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import ProtectedRoute from '../../../components/ProtectedRoute';
import './stats.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

function StatsContent() {
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/stats', {
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch stats');
                }

                const data = await response.json();
                setStats(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="p-4">Loading statistics...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
    if (!stats) return null;

    // Format daily registrations data for chart
    const dailyData = stats.dailyRegistrations.map(day => ({
        date: day._id,
        total: day.total,
        verified: day.verified,
        verificationRate: ((day.verified / day.total) * 100).toFixed(1)
    }));

    return (
        <div className="stats-container">
            <div className="stats-header">
                <h1>Registration Statistics</h1>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="back-button"
                >
                    Back to Dashboard
                </button>
            </div>

            {/* Daily Registrations Chart */}
            <div className="chart-container">
                <h2>Daily Registrations (Last 7 Days)</h2>
                <BarChart width={800} height={300} data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#8884d8" name="Total Registrations" />
                    <Bar dataKey="verified" fill="#82ca9d" name="Verified Registrations" />
                </BarChart>
            </div>

            {/* Event Distribution */}
            <div className="chart-container">
                <h2>Event Distribution</h2>
                <div className="pie-chart-wrapper">
                    <PieChart width={400} height={300}>
                        <Pie
                            data={stats.eventStats}
                            dataKey="count"
                            nameKey="_id"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {stats.eventStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>
            </div>

            {/* Other Statistics */}
            <div className="stats-grid">
                {/* Gender Distribution */}
                <div className="chart-container">
                    <h2>Gender Distribution</h2>
                    <PieChart width={400} height={300}>
                        <Pie
                            data={stats.genderStats}
                            dataKey="count"
                            nameKey="_id"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {stats.genderStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>

                {/* Profession Distribution */}
                <div className="chart-container">
                    <h2>Profession Distribution</h2>
                    <PieChart width={400} height={300}>
                        <Pie
                            data={stats.professionStats}
                            dataKey="count"
                            nameKey="_id"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {stats.professionStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>

                {/* Payment Method Distribution */}
                <div className="chart-container">
                    <h2>Payment Method Distribution</h2>
                    <PieChart width={400} height={300}>
                        <Pie
                            data={stats.paymentMethodStats}
                            dataKey="count"
                            nameKey="_id"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {stats.paymentMethodStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>
            </div>
        </div>
    );
}

export default function Stats() {
    return (
        <ProtectedRoute allowedRoles={['superuser']}>
            <StatsContent />
        </ProtectedRoute>
    );
} 