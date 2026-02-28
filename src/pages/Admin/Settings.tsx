import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "./Dashboard.module.scss";

export default function AdminSettings() {
	const { user, logout } = useAuth();
	const [settings, setSettings] = useState({
		siteName: "Smart Hire",
		supportEmail: "support@smarthire.com",
		maxApplicationsPerDay: 10,
		emailNotifications: true,
		maintenanceMode: false,
	});

	const handleSave = () => {
		// TODO: Implement settings save API
		alert("Settings saved successfully!");
	};

	return (
		<div className={styles.container}>
			<aside className={styles.sidebar}>
				<div className={styles.logo}>Smart Hire Admin</div>
				<nav className={styles.nav}>
					<Link to="/admin">Dashboard</Link>
					<Link to="/admin/users">Users</Link>
					<Link to="/admin/jobs">Jobs</Link>
					<Link to="/admin/settings" className={styles.active}>
						Settings
					</Link>
				</nav>
				<button type="button" onClick={logout} className={styles.logoutBtn}>
					Logout
				</button>
			</aside>
			<main className={styles.main}>
				<header className={styles.header}>
					<h1>Settings</h1>
					<div className={styles.userProfile}>
						<span>Welcome, {user?.name || "Admin"}</span>
					</div>
				</header>
				<div className={styles.content}>
					<div className={styles.settingsSection}>
						<div className={styles.settingsCard}>
							<h2>General Settings</h2>
							<div className={styles.settingsForm}>
								<div className={styles.formGroup}>
									<label htmlFor="siteName">Site Name</label>
									<input
										type="text"
										id="siteName"
										value={settings.siteName}
										onChange={(e) =>
											setSettings({ ...settings, siteName: e.target.value })
										}
									/>
								</div>
								<div className={styles.formGroup}>
									<label htmlFor="supportEmail">Support Email</label>
									<input
										type="email"
										id="supportEmail"
										value={settings.supportEmail}
										onChange={(e) =>
											setSettings({ ...settings, supportEmail: e.target.value })
										}
									/>
								</div>
								<div className={styles.formGroup}>
									<label htmlFor="maxApplications">
										Max Applications Per Day (per user)
									</label>
									<input
										type="number"
										id="maxApplications"
										value={settings.maxApplicationsPerDay}
										onChange={(e) =>
											setSettings({
												...settings,
												maxApplicationsPerDay: Number(e.target.value),
											})
										}
									/>
								</div>
							</div>
						</div>

						<div className={styles.settingsCard}>
							<h2>System Settings</h2>
							<div className={styles.settingsForm}>
								<div className={styles.formGroup}>
									<label>
										<input
											type="checkbox"
											checked={settings.emailNotifications}
											onChange={(e) =>
												setSettings({
													...settings,
													emailNotifications: e.target.checked,
												})
											}
										/>
										<span>Enable Email Notifications</span>
									</label>
								</div>
								<div className={styles.formGroup}>
									<label>
										<input
											type="checkbox"
											checked={settings.maintenanceMode}
											onChange={(e) =>
												setSettings({
													...settings,
													maintenanceMode: e.target.checked,
												})
											}
										/>
										<span>Maintenance Mode</span>
									</label>
									<small
										style={{
											display: "block",
											marginTop: "8px",
											color: "#6b7280",
										}}
									>
										When enabled, only admins can access the site
									</small>
								</div>
							</div>
						</div>

						<div className={styles.settingsActions}>
							<button
								type="button"
								onClick={handleSave}
								className={styles.saveBtn}
							>
								Save Settings
							</button>
							<button type="button" className={styles.cancelBtn}>
								Reset to Default
							</button>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
