import { useAuth } from "@/context/AuthContext";
import styles from "./Dashboard.module.scss";
import { useEffect, useState } from "react";
import { getDashboardStats } from "@/api/admin";
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

interface DashboardStats {
    users: { total: number; active: number };
    companies: { total: number; active: number };
    hr: { total: number; active: number };
    jobs: { active: number; expired: number };
    applications: { total: number; activeApplicants: number };
    recentUsers: {
        id: string;
        name: string;
        email: string;
        createdAt: string;
        status: string;
        profilePicture?: string;
    }[];
    recentCompanies: {
        id: string;
        name: string;
        companyName: string;
        email: string;
        createdAt: string;
        status: string;
        profilePicture?: string;
    }[];
    analytics: {
        userRegistrations: { date: string; count: number }[];
        applicationsOverTime: { date: string; count: number }[];
        jobsByStatus: { status: string; count: number }[];
        usersByRole: { role: string; count: number }[];
    };
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getDashboardStats();
                if (response.success) {
                    setStats(response.data);
                } else {
                    setError("Failed to load statistics");
                }
            } catch (err) {
                console.error(err);
                setError("Error connecting to server");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className={styles.loading}>Loading dashboard...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>Smart Hire Admin</div>
                <nav className={styles.nav}>
                    <a href="/admin" className={styles.active}>
                        Dashboard
                    </a>
                    <a href="/admin/users">Users</a>
                    <a href="/admin/jobs">Jobs</a>
                    <a href="/admin/settings">Settings</a>
                </nav>
                <button type="button" onClick={logout} className={styles.logoutBtn}>
                    Logout
                </button>
            </aside>
            <main className={styles.main}>
                <header className={styles.header}>
                    <h1>Dashboard</h1>
                    <div className={styles.userProfile}>
                        <span>Welcome, {user?.name || "Admin"}</span>
                    </div>
                </header>
                <div className={styles.content}>
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <h3>Users (Candidates)</h3>
                            <div className={styles.statDetails}>
                                <p>Total: <span className={styles.statValue}>{stats?.users.total}</span></p>
                                <p>Active: <span className={styles.statValue}>{stats?.users.active}</span></p>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <h3>Companies</h3>
                            <div className={styles.statDetails}>
                                <p>Total: <span className={styles.statValue}>{stats?.companies.total}</span></p>
                                <p>Active: <span className={styles.statValue}>{stats?.companies.active}</span></p>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <h3>HRs</h3>
                            <div className={styles.statDetails}>
                                <p>Total: <span className={styles.statValue}>{stats?.hr.total}</span></p>
                                <p>Active: <span className={styles.statValue}>{stats?.hr.active}</span></p>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <h3>Jobs</h3>
                            <div className={styles.statDetails}>
                                <p>Active: <span className={styles.statValue}>{stats?.jobs.active}</span></p>
                                <p>Expired: <span className={styles.statValue}>{stats?.jobs.expired}</span></p>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <h3>Applications</h3>
                            <div className={styles.statDetails}>
                                <p>Total: <span className={styles.statValue}>{stats?.applications.total}</span></p>
                                <p>Unique Applicants: <span className={styles.statValue}>{stats?.applications.activeApplicants}</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className={styles.chartsGrid}>
                        <div className={styles.chartCard}>
                            <h3>Jobs by Status</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={stats?.analytics.jobsByStatus}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="status" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className={styles.chartCard}>
                            <h3>User Registrations (Last 7 Days)</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={stats?.analytics.userRegistrations}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className={styles.chartCard}>
                            <h3>Users by Role</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={stats?.analytics.usersByRole}
                                        dataKey="count"
                                        nameKey="role"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label
                                    >
                                        {stats?.analytics.usersByRole.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className={styles.chartCard}>
                            <h3>Applications Trend (Last 7 Days)</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={stats?.analytics.applicationsOverTime}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="count" stroke="#f59e0b" fill="#fbbf24" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className={styles.recentSection}>
                        <h2>Recent Active Users (Candidates)</h2>
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Joined</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.recentUsers.length === 0 ? (
                                        <tr><td colSpan={4}>No recent users found.</td></tr>
                                    ) : (
                                        stats?.recentUsers.map(u => (
                                            <tr key={u.id}>
                                                <td>{u.name}</td>
                                                <td>{u.email}</td>
                                                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                                <td><span className={`${styles.badge} ${styles[u.status.toLowerCase()]}`}>{u.status}</span></td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className={styles.recentSection}>
                        <h2>Recent Active Companies</h2>
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Company Name</th>
                                        <th>Contact Email</th>
                                        <th>Joined</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats?.recentCompanies.length === 0 ? (
                                        <tr><td colSpan={4}>No recent companies found.</td></tr>
                                    ) : (
                                        stats?.recentCompanies.map(c => (
                                            <tr key={c.id}>
                                                <td>{c.companyName || c.name}</td>
                                                <td>{c.email}</td>
                                                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                                                <td><span className={`${styles.badge} ${styles[c.status.toLowerCase()]}`}>{c.status}</span></td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
