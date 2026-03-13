import { useJobFilters } from "../../hooks/useJobFilters";
import type { JobFilterQuery } from "../../../server/types/job.types";
import styles from "./JobSidebar.module.scss";

type JobSidebarProps = {
	filters: JobFilterQuery;
	onFilterChange: (filters: JobFilterQuery) => void;
};

export default function JobSidebar({
	filters,
	onFilterChange,
}: JobSidebarProps) {
	const {
		localFilters,
		handleSearchChange,
		handleLocationChange,
		handleJobTypeToggle,
		// handleTagToggle,
	} = useJobFilters(filters, onFilterChange);

	return (
		<aside className={styles.sidebar}>
			<div className={styles.filterGroup}>
				<h3>Search by Job Title</h3>
				<div className={styles.inputWrapper}>
					<input
						type="text"
						placeholder="Job title or company"
						value={localFilters.search || ""}
						onChange={(e) => handleSearchChange(e.target.value)}
					/>
					<span className={styles.icon}>🔍</span>
				</div>
			</div>

			<div className={styles.filterGroup}>
				<h3>Location</h3>
				<div className={styles.inputWrapper}>
					<input
						type="text"
						placeholder="Choose city"
						value={localFilters.location || ""}
						onChange={(e) => handleLocationChange(e.target.value)}
					/>
					<span className={styles.icon}>📍</span>
				</div>
			</div>

			<div className={styles.filterGroup}>
				<h3>Category</h3>
				<div className={styles.checkboxList}>
					{[
						{ label: "Commerce", count: 10 },
						{ label: "Telecommunications", count: 10 },
						{ label: "Hotels & Tourism", count: 10 },
						{ label: "Education", count: 10 },
						{ label: "Financial Services", count: 10 },
					].map((cat) => (
						<label key={cat.label} className={styles.checkbox}>
							<div className={styles.checkboxLeft}>
								<input type="checkbox" />
								<span>{cat.label}</span>
							</div>
							<span className={styles.count}>{cat.count}</span>
						</label>
					))}
				</div>
				<button type="button" className={styles.showMore}>Show More</button>
			</div>

			<div className={styles.filterGroup}>
				<h3>Job Type</h3>
				<div className={styles.checkboxList}>
					{[
						{ label: "Full Time", value: "FULL_TIME", count: 10 },
						{ label: "Part Time", value: "PART_TIME", count: 10 },
						{ label: "Freelance", value: "FREELANCE", count: 10 },
						{ label: "Seasonal", value: "SEASONAL", count: 10 },
						{ label: "Fixed-Price", value: "FIXED_PRICE", count: 10 },
					].map((type) => (
						<label key={type.value} className={styles.checkbox}>
							<div className={styles.checkboxLeft}>
								<input
									type="checkbox"
									checked={localFilters.jobType === type.value}
									onChange={() => handleJobTypeToggle(type.value)}
								/>
								<span>{type.label}</span>
							</div>
							<span className={styles.count}>{type.count}</span>
						</label>
					))}
				</div>
			</div>

			<div className={styles.filterGroup}>
				<h3>Experience Level</h3>
				<div className={styles.checkboxList}>
					{[
						{ label: "No-experience", count: 10 },
						{ label: "Fresher", count: 10 },
						{ label: "Intermediate", count: 10 },
						{ label: "Expert", count: 10 },
					].map((exp) => (
						<label key={exp.label} className={styles.checkbox}>
							<div className={styles.checkboxLeft}>
								<input type="checkbox" />
								<span>{exp.label}</span>
							</div>
							<span className={styles.count}>{exp.count}</span>
						</label>
					))}
				</div>
			</div>
		</aside>
	);
}
