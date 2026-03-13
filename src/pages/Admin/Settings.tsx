import { Link } from "@tanstack/react-router";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { useAuth } from "@/context/useAuth";
import styles from "./Dashboard.module.scss";

type AdminSettingsState = {
	siteName: string;
	supportEmail: string;
	maxApplicationsPerDay: number;
	emailNotifications: boolean;
	maintenanceMode: boolean;
};

const defaultSettings: AdminSettingsState = {
	siteName: "Smart Hire",
	supportEmail: "support@smarthire.com",
	maxApplicationsPerDay: 10,
	emailNotifications: true,
	maintenanceMode: false,
};

export default function AdminSettings() {
	const { user, logout } = useAuth();
	const [settings, setSettings] = useState<AdminSettingsState>(defaultSettings);

	const handleChange = <K extends keyof AdminSettingsState>(
		key: K,
		value: AdminSettingsState[K],
	) => {
		setSettings((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const handleSave = () => {
		console.log("Saved settings:", settings);
		alert("Settings saved successfully!");
	};

	const handleReset = () => {
		setSettings(defaultSettings);
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
				<Button type="button" onClick={logout} className={styles.logoutBtn}>
					Logout
				</Button>
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
									<Label htmlFor="siteName">Site Name</Label>
									<Input
										id="siteName"
										type="text"
										value={settings.siteName}
										onChange={(e) => handleChange("siteName", e.target.value)}
									/>
								</div>

								<div className={styles.formGroup}>
									<Label htmlFor="supportEmail">Support Email</Label>
									<Input
										id="supportEmail"
										type="email"
										value={settings.supportEmail}
										onChange={(e) =>
											handleChange("supportEmail", e.target.value)
										}
									/>
								</div>

								<div className={styles.formGroup}>
									<Label htmlFor="maxApplications">
										Max Applications Per Day (per user)
									</Label>
									<Input
										id="maxApplications"
										type="number"
										value={settings.maxApplicationsPerDay}
										onChange={(e) =>
											handleChange(
												"maxApplicationsPerDay",
												Number(e.target.value),
											)
										}
									/>
								</div>
							</div>
						</div>

						<div className={styles.settingsCard}>
							<h2>System Settings</h2>
							<div className={styles.settingsForm}>
								<div className={styles.formGroup}>
									<Label>
										<Input
											type="checkbox"
											checked={settings.emailNotifications}
											onChange={(e) =>
												handleChange("emailNotifications", e.target.checked)
											}
										/>
										<span>Enable Email Notifications</span>
									</Label>
								</div>

								<div className={styles.formGroup}>
									<Label>
										<Input
											type="checkbox"
											checked={settings.maintenanceMode}
											onChange={(e) =>
												handleChange("maintenanceMode", e.target.checked)
											}
										/>
										<span>Maintenance Mode</span>
									</Label>
									<small className={styles.helperText}>
										When enabled, only admins can access the site
									</small>
								</div>
							</div>
						</div>

						<div className={styles.settingsActions}>
							<Button
								type="button"
								onClick={handleSave}
								className={styles.saveBtn}
							>
								Save Settings
							</Button>

							<Button
								type="button"
								onClick={handleReset}
								className={styles.cancelBtn}
							>
								Reset to Default
							</Button>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
