import { useEffect, useState } from "react";
import type { JobFilterQuery } from "../../server/types/job.types";

export function useJobFilters(
	initialFilters: JobFilterQuery,
	onFilterChange: (filters: JobFilterQuery) => void,
) {
	const [localFilters, setLocalFilters] = useState(initialFilters);

	// Sync local state if initialFilters change (e.g., reset)
	useEffect(() => {
		setLocalFilters(initialFilters);
	}, [initialFilters]);

	const handleSearchChange = (search: string) => {
		setLocalFilters((prev) => ({ ...prev, search }));
	};

	const handleLocationChange = (location: string) => {
		setLocalFilters((prev) => ({ ...prev, location }));
	};

	const handleSalaryChange = (salaryMin: number) => {
		setLocalFilters((prev) => ({ ...prev, salaryMin }));
	};

	const handleJobTypeToggle = (type: string) => {
		const newType = localFilters.jobType === type ? undefined : type;
		const updated = { ...localFilters, jobType: newType };
		setLocalFilters(updated);
		onFilterChange(updated); // Immediate for checkboxes usually feels better
	};

	const handleTagToggle = (tag: string) => {
		const newSkills = localFilters.skills === tag ? undefined : tag;
		const updated = { ...localFilters, skills: newSkills };
		setLocalFilters(updated);
		onFilterChange(updated);
	};

	// Debounced sync for text inputs
	useEffect(() => {
		const timer = setTimeout(() => {
			if (
				localFilters.search !== initialFilters.search ||
				localFilters.location !== initialFilters.location ||
				localFilters.salaryMin !== initialFilters.salaryMin
			) {
				onFilterChange(localFilters);
			}
		}, 500);
		return () => clearTimeout(timer);
	}, [localFilters, initialFilters, onFilterChange]);

	return {
		localFilters,
		handleSearchChange,
		handleLocationChange,
		handleSalaryChange,
		handleJobTypeToggle,
		handleTagToggle,
	};
}
