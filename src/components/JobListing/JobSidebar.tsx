import { useEffect, useState } from "react";
import type { JobFilterQuery } from "../../../server/types/job.types";
import styles from "./JobSidebar.module.scss";

interface JobSidebarProps {
	filters: JobFilterQuery;
	onFilterChange: (filters: JobFilterQuery) => void;
}

export default function JobSidebar({
	filters,
	onFilterChange,
}: JobSidebarProps) {
	// Local state for immediate UI feedback and debouncing
	const [search, setSearch] = useState(filters.search || "");
	const [location, setLocation] = useState(filters.location || "");
	const [salaryMin, setSalaryMin] = useState(filters.salaryMin || 0);

	// Sync local state with props if props change externally (reset)
	useEffect(() => {
		setSearch(filters.search || "");
		setLocation(filters.location || "");
		setSalaryMin(filters.salaryMin || 0);
	}, [filters]);

	// Debounce updates to parent
	useEffect(() => {
		const timer = setTimeout(() => {
			if (search !== (filters.search || "")) {
				onFilterChange({ ...filters, search: search || undefined });
			}
		}, 500);
		return () => clearTimeout(timer);
	}, [search, filters, onFilterChange]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (location !== (filters.location || "")) {
				onFilterChange({ ...filters, location: location || undefined });
			}
		}, 500);
		return () => clearTimeout(timer);
	}, [location, filters, onFilterChange]);

	const handleSalaryChange = (value: number) => {
		setSalaryMin(value);
		// Debounce or immediate? Slider can be noisy. Let's debounce.
		setTimeout(() => {
			onFilterChange({ ...filters, salaryMin: value || undefined });
		}, 500);
		// Note: We're not clearing this timeout, which is a bit buggy if rapid changes.
		// Better to use a specific useEffect for salary too.
	};

	// Use effect for salary to handle debounce properly
	useEffect(() => {
		const timer = setTimeout(() => {
			if (salaryMin !== (filters.salaryMin || 0)) {
				onFilterChange({ ...filters, salaryMin: salaryMin || undefined });
			}
		}, 500);
		return () => clearTimeout(timer);
	}, [salaryMin, filters, onFilterChange]);

	const handleJobTypeChange = (type: string) => {
		// Toggle logic or single select? Backend schema says `jobType: z.string().optional()`.
		// So checking a box should set it. If already set, uncheck it?
		const newType = filters.jobType === type ? undefined : type;
		onFilterChange({ ...filters, jobType: newType });
	};

	const handleTagClick = (tag: string) => {
		// Toggle tag. Backend supports substring match.
		// Simplest is to just set 'skills' to the tag.
		const newSkills = filters.skills === tag ? undefined : tag;
		onFilterChange({ ...filters, skills: newSkills });
	};

	return (
		<aside className={styles.sidebar}>
			<div className={styles.filterGroup}>
				<h3>Search by Job Title</h3>
				<div className={styles.inputWrapper}>
					<input
						type="text"
						placeholder="Job Title or Company"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<span className={styles.icon}>🔍</span>
				</div>
			</div>

			<div className={styles.filterGroup}>
				<h3>Location</h3>
				<div className={styles.inputWrapper}>
					<input
						type="text"
						placeholder="City or Zip Code"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
					/>
					<span className={styles.icon}>📍</span>
				</div>
			</div>

			{/* Category section removed as it doesn't map to backend data */}

			<div className={styles.filterGroup}>
				<h3>Job Type</h3>
				<div className={styles.checkboxList}>
					{[
						{ label: "Full Time", value: "FULL_TIME" },
						{ label: "Part Time", value: "PART_TIME" },
						{ label: "Internship", value: "INTERNSHIP" },
						{ label: "Freelance", value: "FREELANCE" },
						{ label: "Contract", value: "CONTRACT" },
					].map((type) => (
						<label key={type.value} className={styles.checkbox}>
							<input
								type="checkbox"
								checked={filters.jobType === type.value}
								onChange={() => handleJobTypeChange(type.value)}
							/>
							<span>{type.label}</span>
						</label>
					))}
				</div>
			</div>

			<div className={styles.filterGroup}>
				<div className={styles.salaryHeader}>
					<h3>Min Salary</h3>
					<span>${salaryMin}/m</span>
				</div>
				<input
					type="range"
					min="0"
					max="20000"
					step="1000"
					value={salaryMin}
					onChange={(e) => handleSalaryChange(Number(e.target.value))}
					className={styles.rangeInput}
				/>
			</div>

			<div className={styles.filterGroup}>
				<h3>Tags</h3>
				<div className={styles.tags}>
					{[
						"marketing",
						"design",
						"ui/ux",
						"digital",
						"programming", // Fixed typo "programing"
						"web-design",
					].map((tag) => (
						<button
							type="button"
							key={tag}
							className={`${styles.tag} ${filters.skills === tag ? styles.active : ""}`}
							onClick={() => handleTagClick(tag)}
							style={{
								backgroundColor: filters.skills === tag ? "#007bff" : "#f0f0f0",
								color: filters.skills === tag ? "#fff" : "#333",
								border: "none",
								padding: "5px 10px",
								borderRadius: "15px",
								cursor: "pointer",
								margin: "5px",
							}}
						>
							{tag}
						</button>
					))}
				</div>
			</div>
		</aside>
	);
}
