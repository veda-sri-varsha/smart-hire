import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { getAllUsers, updateUserStatus } from "@/api/admin";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/useAuth";
import type { User } from "../../../server/types/auth.types";
import styles from "./Dashboard.module.scss";

type RoleFilter = "ALL" | "USER" | "HR" | "COMPANY" | "ADMIN";
type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE" | "BLOCKED";

export default function AdminUsers() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

	// 🔐 Auth Guard
	useEffect(() => {
		if (!user) {
			navigate({ to: "/login" });
			return;
		}
		if (user.role !== "ADMIN") {
			navigate({ to: "/" });
		}
	}, [user, navigate]);

	// 📦 Fetch Users (ONLY ONE QUERY)
	const {
		data: users = [],
		isLoading,
		isError,
	} = useQuery<User[]>({
		queryKey: ["admin-users"],
		queryFn: async () => {
			const response = await getAllUsers(1, 100);
			return response.data.users;
		},
		enabled: !!user && user.role === "ADMIN",
	});

	// 🔄 Update Status Mutation
	const mutation = useMutation({
		mutationFn: ({
			userId,
			newStatus,
		}: {
			userId: string;
			newStatus: string;
		}) => updateUserStatus(userId, newStatus),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["admin-users"] });
		},
	});

	// 🎯 Filtering
	const filteredUsers = useMemo(() => {
		return users.filter((u) => {
			const roleMatch = roleFilter === "ALL" || u.role === roleFilter;
			const statusMatch = statusFilter === "ALL" || u.status === statusFilter;
			return roleMatch && statusMatch;
		});
	}, [users, roleFilter, statusFilter]);

	// 📊 Stats
	const stats = useMemo(() => {
		return {
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
	}, [users]);

	// 🕒 Date Formatter (handles both string & Date safely)
	const formatDateTime = (date: string | Date) =>
		new Date(date).toLocaleString("en-IN", {
			year: "numeric",
			month: "short",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		});

	if (isLoading) {
		return <div className={styles.loading}>Loading users...</div>;
	}

	if (isError) {
		return <div className={styles.error}>Failed to load users</div>;
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
				<Button type="button" onClick={logout} className={styles.logoutBtn}>
					Logout
				</Button>
			</aside>

			<main className={styles.main}>
				<header className={styles.header}>
					<h1>Users Management</h1>
					<div className={styles.userProfile}>
						<span>Welcome, {user?.name || "Admin"}</span>
					</div>
				</header>

				<div className={styles.content}>
					{/* Filters */}
					<div className={styles.filterSection}>
						<div className={styles.filterGroup}>
							<h3>Filter by Role:</h3>
							<div className={styles.filterTabs}>
								{(
									["ALL", "USER", "HR", "COMPANY", "ADMIN"] as RoleFilter[]
								).map((role) => (
									<Button
										key={role}
										className={roleFilter === role ? styles.activeTab : ""}
										onClick={() => setRoleFilter(role)}
									>
										{role} {role !== "ALL" && `(${stats.byRole[role]})`}
									</Button>
								))}
							</div>
						</div>

						<div className={styles.filterGroup}>
							<h3>Filter by Status:</h3>
							<div className={styles.filterTabs}>
								{(
									["ALL", "ACTIVE", "INACTIVE", "BLOCKED"] as StatusFilter[]
								).map((status) => (
									<Button
										key={status}
										className={statusFilter === status ? styles.activeTab : ""}
										onClick={() => setStatusFilter(status)}
									>
										{status !== "ALL" &&
											`(${
												stats.byStatus[status as keyof typeof stats.byStatus]
											})`}{" "}
										{status}
									</Button>
								))}
							</div>
						</div>
					</div>

					{/* Table */}
					<div className={styles.recentSection}>
						<h2>Users ({filteredUsers.length})</h2>
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
												style={{ textAlign: "center", padding: 20 }}
											>
												No users found.
											</td>
										</tr>
									) : (
										filteredUsers.map((u) => (
											<tr key={u.id}>
												<td>{u.name}</td>
												<td>{u.email}</td>
												<td>{u.role}</td>
												<td>{u.status}</td>
												<td>{u.isEmailVerified ? "✅" : "❌"}</td>
												<td>{u.location || "-"}</td>
												<td>{formatDateTime(u.createdAt)}</td>
												<td>
													<select
														value={u.status}
														onChange={(e) =>
															mutation.mutate({
																userId: u.id,
																newStatus: e.target.value,
															})
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
