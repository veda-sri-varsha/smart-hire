import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAllUsers, updateUserStatus } from "@/api/admin";
import { useAuth } from "@/context/AuthContext";
import styles from "./Dashboard.module.scss";

interface User {
	id: string;
	name: string;
	email: string;
	role: string;
	status: string;
	createdAt: string;
	location?: string;
	phone?: string;
	isEmailVerified: boolean;
}

type RoleFilter = "ALL" | "USER" | "HR" | "COMPANY" | "ADMIN";
type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE" | "BLOCKED";

export default function AdminUsers() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [users, setUsers] = useState<User[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

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

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const response = await getAllUsers(1, 100); // Fetch more for client-side filtering
			if (response.success) {
				setUsers(response.data.users);
			} else {
				setError("Failed to load users");
			}
		} catch (err) {
			console.error(err);
			setError("Error connecting to server");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	// Apply filters
	useEffect(() => {
		let filtered = [...users];

		if (roleFilter !== "ALL") {
			filtered = filtered.filter((u) => u.role === roleFilter);
		}

		if (statusFilter !== "ALL") {
			filtered = filtered.filter((u) => u.status === statusFilter);
		}

		setFilteredUsers(filtered);
	}, [users, roleFilter, statusFilter]);

	const handleStatusChange = async (userId: string, newStatus: string) => {
		try {
			await updateUserStatus(userId, newStatus);
			fetchUsers();
		} catch (err) {
			console.error("Failed to update user status", err);
			alert("Failed to update user status");
		}
	};

	const formatDate = (date: string) => new Date(date).toLocaleDateString();

	// Stats by role and status
	const stats = {
		byRole: {
			USER: users.filter((u) => u.role === "USER").length,
			HR: users.filter((u) => u.role === "HR").length,
			COMPANY: users.filter((u) => u.role === "COMPANY").length,
			ADMIN: users.filter((u) => u.role === "ADMIN").length,
		},
		byStatus: {
			ACTIVE: users.filter((u) => u.status === "ACTIVE").length,
			INACTIVE: users.filter((u) => u.status === "INACTIVE").length,
			BLOCKED: users.filter((u) => u.status === "BLOCKED").length,
		},
	};

	if (loading && users.length === 0) {
		return <div className={styles.loading}>Loading users...</div>;
	}

	if (error && users.length === 0) {
		return <div className={styles.error}>{error}</div>;
	}

	return (
		<div className={styles.container}>
			<aside className={styles.sidebar}>
				<div className={styles.logo}>Smart Hire Admin</div>
				<nav className={styles.nav}>
					<Link to="/admin">Dashboard</Link>
					<Link to="/admin/users" className={styles.active}>
						Users
					</Link>
					<Link to="/admin/jobs">Jobs</Link>
					<Link to="/admin/settings">Settings</Link>
				</nav>
				<button type="button" onClick={logout} className={styles.logoutBtn}>
					Logout
				</button>
			</aside>
			<main className={styles.main}>
				<header className={styles.header}>
					<h1>Users Management</h1>
					<div className={styles.userProfile}>
						<span>Welcome, {user?.name || "Admin"}</span>
					</div>
				</header>
				<div className={styles.content}>
					{/* Filter Tabs */}
					<div className={styles.filterSection}>
						<div className={styles.filterGroup}>
							<h3>Filter by Role:</h3>
							<div className={styles.filterTabs}>
								<button
									className={roleFilter === "ALL" ? styles.activeTab : ""}
									onClick={() => setRoleFilter("ALL")}
								>
									All ({users.length})
								</button>
								<button
									className={roleFilter === "USER" ? styles.activeTab : ""}
									onClick={() => setRoleFilter("USER")}
								>
									Candidates ({stats.byRole.USER})
								</button>
								<button
									className={roleFilter === "HR" ? styles.activeTab : ""}
									onClick={() => setRoleFilter("HR")}
								>
									HR ({stats.byRole.HR})
								</button>
								<button
									className={roleFilter === "COMPANY" ? styles.activeTab : ""}
									onClick={() => setRoleFilter("COMPANY")}
								>
									Companies ({stats.byRole.COMPANY})
								</button>
								<button
									className={roleFilter === "ADMIN" ? styles.activeTab : ""}
									onClick={() => setRoleFilter("ADMIN")}
								>
									Admins ({stats.byRole.ADMIN})
								</button>
							</div>
						</div>

						<div className={styles.filterGroup}>
							<h3>Filter by Status:</h3>
							<div className={styles.filterTabs}>
								<button
									className={statusFilter === "ALL" ? styles.activeTab : ""}
									onClick={() => setStatusFilter("ALL")}
								>
									All
								</button>
								<button
									className={statusFilter === "ACTIVE" ? styles.activeTab : ""}
									onClick={() => setStatusFilter("ACTIVE")}
								>
									Active ({stats.byStatus.ACTIVE})
								</button>
								<button
									className={
										statusFilter === "INACTIVE" ? styles.activeTab : ""
									}
									onClick={() => setStatusFilter("INACTIVE")}
								>
									Inactive ({stats.byStatus.INACTIVE})
								</button>
								<button
									className={statusFilter === "BLOCKED" ? styles.activeTab : ""}
									onClick={() => setStatusFilter("BLOCKED")}
								>
									Blocked ({stats.byStatus.BLOCKED})
								</button>
							</div>
						</div>
					</div>

					<div className={styles.recentSection}>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: "20px",
							}}
						>
							<h2>Users ({filteredUsers.length})</h2>
						</div>
						<div className={styles.tableWrapper}>
							<table className={styles.table}>
								<thead>
									<tr>
										<th>Name</th>
										<th>Email</th>
										<th>Role</th>
										<th>Status</th>
										<th>Verified</th>
										<th>Location</th>
										<th>Joined</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{filteredUsers.length === 0 ? (
										<tr>
											<td
												colSpan={8}
												style={{ textAlign: "center", padding: "20px" }}
											>
												No users found for selected filters.
											</td>
										</tr>
									) : (
										filteredUsers.map((u) => (
											<tr key={u.id}>
												<td>{u.name}</td>
												<td>{u.email}</td>
												<td>
													<span
														className={`${styles.badge} ${styles[`badge${u.role}`]}`}
													>
														{u.role}
													</span>
												</td>
												<td>
													<span
														className={`${styles.badge} ${styles[`badge${u.status}`]}`}
													>
														{u.status}
													</span>
												</td>
												<td>{u.isEmailVerified ? "✅" : "❌"}</td>
												<td>{u.location || "-"}</td>
												<td>{formatDate(u.createdAt)}</td>
												<td>
													<select
														value={u.status}
														onChange={(e) =>
															handleStatusChange(u.id, e.target.value)
														}
														className={styles.actionSelect}
													>
														<option value="ACTIVE">Active</option>
														<option value="INACTIVE">Inactive</option>
														<option value="BLOCKED">Blocked</option>
													</select>
												</td>
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
