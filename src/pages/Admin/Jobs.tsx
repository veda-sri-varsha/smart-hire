import { Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { deleteJobById, getAllJobs } from "@/api/admin";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/useAuth";
import type {
	JobResponse,
	PaginatedJobsResponse,
} from "../../../server/types/job.types";
import styles from "./Dashboard.module.scss";

export default function AdminJobs() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const [jobs, setJobs] = useState<JobResponse[]>([]);
	const [pagination, setPagination] = useState<
		PaginatedJobsResponse["pagination"] | null
	>(null);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!user) {
			navigate({ to: "/login" });
			return;
		}

		if (user.role !== "ADMIN") {
			navigate({ to: "/" });
		}
	}, [user, navigate]);

	const fetchJobs = useCallback(async (page: number) => {
		try {
			setLoading(true);
			setError(null);

			const response = await getAllJobs(page, 20);

			if (!response?.success) {
				throw new Error(
					response?.error || response?.message || "Failed to load jobs",
				);
			}

			setJobs(response.data.data);
			setPagination(response.data.pagination);
		} catch (err) {
			console.error("Error fetching jobs:", err);
			setError("Unable to load jobs. Please try again.");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchJobs(currentPage);
	}, [currentPage, fetchJobs]);

	const handleArchiveJob = async (jobId: string) => {
		const confirmed = window.confirm(
			"Are you sure you want to archive this job?",
		);
		if (!confirmed) return;

		try {
			await deleteJobById(jobId);
			fetchJobs(currentPage);
		} catch (err) {
			console.error("Failed to archive job:", err);
			alert("Failed to archive job. Please try again.");
		}
	};

	const formatDate = (date: string | Date) => new Date(date).toLocaleDateString();

	if (loading) {
		return <div className={styles.loading}>Loading jobs...</div>;
	}

	if (error) {
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

				<Button type="button" onClick={logout} className={styles.logoutBtn}>
					Logout
				</Button>
			</aside>

			<main className={styles.main}>
				<header className={styles.header}>
					<h1>Jobs Management</h1>
					<div className={styles.userProfile}>
						<span>Welcome, {user?.name ?? "Admin"}</span>
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
							<h2>All Jobs ({pagination?.total ?? 0})</h2>
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
												style={{ textAlign: "center", padding: 20 }}
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
														style={{
															color: "#3b82f6",
															textDecoration: "none",
														}}
													>
														{job.title}
													</Link>
												</td>

												<td>
													{job.company.companyName ?? job.company.name ?? "—"}
												</td>

												<td>{job.location}</td>

												<td>
													<span className={styles.badge}>{job.jobType}</span>
												</td>

												<td>
													<span
														className={`${styles.badge} ${
															styles[`badge${job.status}`]
														}`}
													>
														{job.status}
													</span>
												</td>

												<td>{job._count?.applications ?? 0}</td>

												<td>{formatDate(job.createdAt)}</td>

												<td>
													<Button
														type="button"
														onClick={() => handleArchiveJob(job.id)}
														className={styles.actionBtn}
														disabled={job.status === "ARCHIVED"}
													>
														Archive
													</Button>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>

						{pagination && pagination.totalPages > 1 && (
							<div className={styles.pagination}>
								<Button
									onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
									disabled={currentPage === 1}
								>
									Previous
								</Button>

								<span>
									Page {currentPage} of {pagination.totalPages}
								</span>

								<Button
									onClick={() =>
										setCurrentPage((p) =>
											Math.min(pagination.totalPages, p + 1),
										)
									}
									disabled={currentPage === pagination.totalPages}
								>
									Next
								</Button>
							</div>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
