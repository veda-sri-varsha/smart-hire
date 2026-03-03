import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import { getDashboardStats } from "@/api/admin";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/useAuth";

import styles from "./Dashboard.module.scss";

type DashboardStats = {
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
	}[];
	recentCompanies: {
		id: string;
		name: string;
		companyName: string;
		email: string;
		createdAt: string;
		status: string;
	}[];
	analytics: {
		userRegistrations: { date: string; count: number }[];
		applicationsOverTime: { date: string; count: number }[];
		jobsByStatus: { status: string; count: number }[];
		usersByRole: { role: string; count: number }[];
	};
};

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function AdminDashboard() {
	const { user, logout } = useAuth();

	const {
		data: stats,
		isLoading,
		isError,
		refetch,
	} = useQuery<DashboardStats>({
		queryKey: ["admin-dashboard"],
		queryFn: async () => {
			const response = await getDashboardStats();
			if (!response.success) {
				throw new Error("Failed to fetch dashboard stats");
			}
			return response.data;
		},
		enabled: !!user && user.role === "ADMIN",
	});

	if (isLoading) {
		return <div className={styles.loading}>Loading dashboard...</div>;
	}

	if (isError || !stats) {
		return (
			<div className={styles.error}>
				<p>Failed to load dashboard</p>
				<Button onClick={() => refetch()}>Retry</Button>
			</div>
		);
	}

	const totalJobs = stats.jobs.active + stats.jobs.expired;

	return (
		<div className={styles.container}>
			<aside className={styles.sidebar}>
				<div className={styles.logo}>Smart Hire Admin</div>
				<nav className={styles.nav}>
					<Link to="/admin" className={styles.active}>
						Dashboard
					</Link>
					<Link to="/admin/users">Users</Link>
					<Link to="/admin/jobs">Jobs</Link>
					<Link to="/admin/settings">Settings</Link>
				</nav>
				<Button onClick={logout} className={styles.logoutBtn}>
					Logout
				</Button>
			</aside>

			<main className={styles.main}>
				<header className={styles.header}>
					<h1>Dashboard</h1>
					<div className={styles.userProfile}>
						<span>Welcome, {user?.name || "Admin"}</span>
					</div>
				</header>

				<div className={styles.content}>
					{/* Stats Cards */}
					<div className={styles.statsGrid}>
						<StatCard
							title="Users"
							total={stats.users.total}
							active={stats.users.active}
						/>
						<StatCard
							title="Companies"
							total={stats.companies.total}
							active={stats.companies.active}
						/>
						<StatCard
							title="HRs"
							total={stats.hr.total}
							active={stats.hr.active}
						/>
						<StatCard
							title="Jobs"
							total={totalJobs}
							active={stats.jobs.active}
							labelActive="Active"
						/>
						<StatCard
							title="Applications"
							total={stats.applications.total}
							active={stats.applications.activeApplicants}
							labelActive="Unique Applicants"
						/>
					</div>

					{/* Charts */}
					<div className={styles.chartsGrid}>
						<ChartCard title="Jobs by Status">
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={stats.analytics.jobsByStatus}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="status" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Bar dataKey="count" fill="#3b82f6" />
								</BarChart>
							</ResponsiveContainer>
						</ChartCard>

						<ChartCard title="User Registrations">
							<ResponsiveContainer width="100%" height={300}>
								<LineChart data={stats.analytics.userRegistrations}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="date" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Line type="monotone" dataKey="count" stroke="#10b981" />
								</LineChart>
							</ResponsiveContainer>
						</ChartCard>

						<ChartCard title="Users by Role">
							<ResponsiveContainer width="100%" height={300}>
								<PieChart>
									<Pie
										data={stats.analytics.usersByRole}
										dataKey="count"
										nameKey="role"
										cx="50%"
										cy="50%"
										outerRadius={80}
										label
									>
										{stats.analytics.usersByRole.map((entry, i) => (
											<Cell key={entry.role} fill={COLORS[i % COLORS.length]} />
										))}
									</Pie>
									<Tooltip />
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						</ChartCard>

						<ChartCard title="Applications Trend">
							<ResponsiveContainer width="100%" height={300}>
								<AreaChart data={stats.analytics.applicationsOverTime}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="date" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Area
										type="monotone"
										dataKey="count"
										stroke="#f59e0b"
										fill="#fbbf24"
									/>
								</AreaChart>
							</ResponsiveContainer>
						</ChartCard>
					</div>
				</div>
			</main>
		</div>
	);
}

/* ---------------- Reusable Components ---------------- */

function StatCard({
	title,
	total,
	active,
	labelActive = "Active",
}: {
	title: string;
	total: number;
	active: number;
	labelActive?: string;
}) {
	return (
		<div className={styles.statCard}>
			<h3>{title}</h3>
			<p>
				Total: <strong>{total}</strong>
			</p>
			<p>
				{labelActive}: <strong>{active}</strong>
			</p>
		</div>
	);
}

function ChartCard({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className={styles.chartCard}>
			<h3>{title}</h3>
			{children}
		</div>
	);
}
