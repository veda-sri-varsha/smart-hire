import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { deleteJobById, getAllJobs } from "@/api/admin";
import { useAuth } from "@/context/AuthContext";
import styles from "./Dashboard.module.scss";

interface Job {
	id: string;
	title: string;
	status: string;
	createdAt: string;
	location: string;
	jobType: string;
	salaryRange?: string;
	company: {
		id: string;
		name: string;
		companyName: string;
		email: string;
	};
	_count: {
		applications: number;
	};
}

interface Pagination {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export default function AdminJobs() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [jobs, setJobs] = useState<Job[]>([]);
	const [pagination, setPagination] = useState<Pagination | null>(null);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [error, setError] = useState<string | null>(null);

	// Check if user is logged in and is admin
	useEffect(() => {
		if (!user) {
			navigate({ to: "/login" });
			return;
		}
		if (user.role !== "ADMIN") {
			alert("Access denied. Admin role required.");
			navigate({ to: "/" });
		}
	}, [user, navigate]);

	const fetchJobs = async (page = 1) => {
		setLoading(true);
		setError(null);
		try {
			const response = await getAllJobs(page, 20);

			if (response.success) {
				setJobs(response.data.jobs);
				setPagination(response.data.pagination);
			} else {
				const errorMsg =
					response.error || response.message || "Failed to load jobs";
				setError(errorMsg);
			}
		} catch (err: any) {
			console.error("Error fetching jobs:", err);
			const errorMessage =
				err.response?.data?.error ||
				err.response?.data?.message ||
				err.message ||
				"Error connecting to server";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchJobs(currentPage);
	}, [currentPage]);

	const handleDeleteJob = async (jobId: string) => {
		if (!confirm("Are you sure you want to archive this job?")) return;

		try {
			await deleteJobById(jobId);
			fetchJobs(currentPage);
		} catch (err) {
			console.error("Failed to delete job", err);
			alert("Failed to delete job");
		}
	};

	const formatDate = (date: string) => new Date(date).toLocaleDateString();

	if (loading && jobs.length === 0) {
		return <div className={styles.loading}>Loading jobs...</div>;
	}

	if (error && jobs.length === 0) {
		return <div className={styles.error}>{error}</div>;
	}

	return (
		<div className={styles.container}>
			<aside className={styles.sidebar}>
				<div className={styles.logo}>Smart Hire Admin</div>
				<nav className={styles.nav}>
					<Link to="/admin">Dashboard</Link>
					<Link to="/admin/users">Users</Link>
					<Link to="/admin/jobs" className={styles.active}>
						Jobs
					</Link>
					<Link to="/admin/settings">Settings</Link>
				</nav>
				<button type="button" onClick={logout} className={styles.logoutBtn}>
					Logout
				</button>
			</aside>
			<main className={styles.main}>
				<header className={styles.header}>
					<h1>Jobs Management</h1>
					<div className={styles.userProfile}>
						<span>Welcome, {user?.name || "Admin"}</span>
					</div>
				</header>
				<div className={styles.content}>
					<div className={styles.recentSection}>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: "20px",
							}}
						>
							<h2>All Jobs ({pagination?.total || 0})</h2>
						</div>
						<div className={styles.tableWrapper}>
							<table className={styles.table}>
								<thead>
									<tr>
										<th>Title</th>
										<th>Company</th>
										<th>Location</th>
										<th>Type</th>
										<th>Status</th>
										<th>Applications</th>
										<th>Posted</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{jobs.length === 0 ? (
										<tr>
											<td
												colSpan={8}
												style={{ textAlign: "center", padding: "20px" }}
											>
												No jobs found.
											</td>
										</tr>
									) : (
										jobs.map((job) => (
											<tr key={job.id}>
												<td>
													<Link
														to="/jobs/$jobId"
														params={{ jobId: job.id }}
														style={{ color: "#3b82f6", textDecoration: "none" }}
													>
														{job.title}
													</Link>
												</td>
												<td>{job.company.companyName || job.company.name}</td>
												<td>{job.location}</td>
												<td>
													<span className={styles.badge}>{job.jobType}</span>
												</td>
												<td>
													<span
														className={`${styles.badge} ${styles[`badge${job.status}`]}`}
													>
														{job.status}
													</span>
												</td>
												<td>{job._count.applications}</td>
												<td>{formatDate(job.createdAt)}</td>
												<td>
													<button
														type="button"
														onClick={() => handleDeleteJob(job.id)}
														className={styles.actionBtn}
														disabled={job.status === "ARCHIVED"}
													>
														Archive
													</button>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>

						{pagination && pagination.totalPages > 1 && (
							<div className={styles.pagination}>
								<button
									onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
									disabled={currentPage === 1}
								>
									Previous
								</button>
								<span>
									Page {currentPage} of {pagination.totalPages}
								</span>
								<button
									onClick={() =>
										setCurrentPage((p) =>
											Math.min(pagination.totalPages, p + 1),
										)
									}
									disabled={currentPage === pagination.totalPages}
								>
									Next
								</button>
							</div>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
