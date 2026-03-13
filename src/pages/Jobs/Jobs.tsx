import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { applyToJob } from "@/api/applications";
import { getJobs } from "@/api/jobs";
import ApplyModal from "@/components/ApplyModal/ApplyModal";
import JobSidebar from "@/components/JobListing/JobSidebar";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { companiesData } from "@/constants/Jobs";
import { useAuth } from "@/context/useAuth";
import type {
	JobFilterQuery,
	JobResponse,
} from "../../../server/types/job.types";
import "./Jobs.scss";

const Jobs = () => {
	const searchParams = useSearch({ from: "/jobs" }) as any;
	const [filters, setFilters] = useState<JobFilterQuery>({
		search: searchParams.title || "",
		location: searchParams.location || "",
		skills: searchParams.category || "",
		sortBy: "createdAt",
		order: "desc",
	});

	useEffect(() => {
		setFilters((prev) => ({
			...prev,
			search: searchParams.title || "",
			location: searchParams.location || "",
			skills: searchParams.category || "",
		}));
	}, [searchParams]);
	const [selectedJob, setSelectedJob] = useState<JobResponse | null>(null);
	const [appliedJobs, setAppliedJobs] = useState<string[]>(() => {
		const saved = localStorage.getItem("appliedJobs");
		return saved ? JSON.parse(saved) : [];
	});

	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const [showFilters, setShowFilters] = useState(false);

	// Fetch jobs with TanStack Query
	const {
		data: jobs = [],
		isLoading,
		isError,
		error,
	} = useQuery<JobResponse[]>({
		queryKey: ["jobs", filters],
		queryFn: () => getJobs(filters).then((res) => res.data),
	});

	const handleApplyClick = (job: JobResponse) => {
		if (!isAuthenticated) {
			navigate({ to: "/login" });
			return;
		}
		setSelectedJob(job);
	};

	const handleSubmitApplication = async (data: {
		resumeFile: File;
		coverLetter?: string;
	}) => {
		if (!selectedJob) return;

		try {
			const formData = new FormData();
			formData.append("jobId", selectedJob.id);
			formData.append(
				"coverLetter",
				data.coverLetter || "Excited to apply for this role!",
			);
			formData.append("resume", data.resumeFile);

			await applyToJob(formData);

			const updatedApplied = [...appliedJobs, selectedJob.id];
			setAppliedJobs(updatedApplied);
			localStorage.setItem("appliedJobs", JSON.stringify(updatedApplied));

			alert("Application submitted successfully!");
			setSelectedJob(null);
		} catch (err: unknown) {
			console.error(err);
			let errorMessage = "Failed to submit application.";
			if (err instanceof Error) errorMessage = err.message;
			else if (typeof err === "object" && err !== null && "response" in err) {
				const response = (
					err as { response?: { data?: Record<string, unknown> } }
				).response;
				if (response?.data?.error) errorMessage = String(response.data.error);
				else if (response?.data?.message)
					errorMessage = String(response.data.message);
			}
			alert(errorMessage);
		}
	};

	return (
		<div className="jobs-page">
			<div className="jobs-page__header">
				<h1 className="jobs-page__title">Jobs</h1>
			</div>

			<div className="jobs-page__content">
				<Button
					className="mobile-filter-toggle"
					onClick={() => setShowFilters(!showFilters)}
				>
					<span>Filters</span>
					<span className="icon">⚙️</span>
				</Button>

				<div
					className={`jobs-page__sidebar-wrapper ${showFilters ? "show" : ""}`}
				>
					<JobSidebar filters={filters} onFilterChange={setFilters} />
				</div>

				<div className="jobs-page__list">
					<div className="jobs-page__controls">
						<h2>Showing {jobs.length} Jobs</h2>
						<div className="jobs-page__sort">
							<label htmlFor="sort">Sort by:</label>
							<Select
								id="sort"
								value={`${filters.sortBy ?? "createdAt"}-${filters.order ?? "desc"}`}
								onChange={(e) => {
									const value = e.target.value;
									// Split on the LAST dash to handle field names like "salaryMax"
									const lastDash = value.lastIndexOf("-");
									const field = value.substring(0, lastDash);
									const order = value.substring(lastDash + 1);
									setFilters((prev) => ({
										...prev,
										sortBy: field,
										order: order as "asc" | "desc",
									}));
								}}
								options={[
									{ value: "createdAt-desc", label: "Newest" },
									{ value: "createdAt-asc", label: "Oldest" },
									{ value: "salaryMax-desc", label: "Salary: High to Low" },
									{ value: "salaryMin-asc", label: "Salary: Low to High" },
								]}
							/>
						</div>
					</div>

					{isLoading && <p>Loading jobs...</p>}
					{isError && (
						<p className="error-message">
							{(error as Error)?.message || "Failed to load jobs."}
						</p>
					)}
					{!isLoading && jobs.length === 0 && (
						<div className="jobs-page__no-results">
							<p>No jobs found matching your criteria.</p>
							<Button
								className="back-btn"
								onClick={() => {
									setFilters({});
									navigate({ to: "/jobs" });
								}}
							>
								Back to Jobs
							</Button>
						</div>
					)}

					{jobs.map((job: JobResponse) => (
						<div key={job.id} className="job-card">
							<div className="job-card__info">
								<h2 className="job-card__title">{job.title}</h2>
								<div className="job-card__meta">
									<span>{job.jobType.replace("_", " ")}</span>
									<span>•</span>
									<span>{job.location}</span>
									<span>•</span>
									<span className="job-card__salary">
										${job.salaryMin} - ${job.salaryMax}
									</span>
								</div>
								<div className="job-card__tags">
									{job.skills.split(",").map((skill: string) => (
										<span key={skill} className="tag">
											{skill.trim()}
										</span>
									))}
								</div>
							</div>
							<div className="job-card__actions">
								<Link to="/jobs/$jobId" params={{ jobId: job.id }}>
									<Button type="button" className="view-btn">
										View Details
									</Button>
								</Link>
								<Button
									type="button"
									className={`apply-btn ${appliedJobs.includes(job.id) ? "applied" : ""}`}
									onClick={() => handleApplyClick(job)}
									disabled={appliedJobs.includes(job.id)}
								>
									{appliedJobs.includes(job.id) ? "Applied ✓" : "Apply Now"}
								</Button>
							</div>
						</div>
					))}
				</div>
			</div>

			<section className="top-companies">
				<h2 className="top-companies__title">Top Companies</h2>
				<p className="top-companies__subtitle">
					At eu lobortis pretium tincidunt amet lacus ut aenean aliquet.
				</p>
				<div className="top-companies__list">
					{companiesData.map((company) => (
						<div key={company.id} className="company-card">
							<img
								src={company.logo}
								alt={company.name}
								className="company-card__logo"
							/>
							<h3 className="company-card__name">{company.name}</h3>
							<p className="company-card__desc">{company.description}</p>
							<Button type="button" className="company-card__jobs">
								{company.openJobs} open jobs
							</Button>
						</div>
					))}
				</div>
			</section>

			{selectedJob && (
				<ApplyModal
					jobTitle={selectedJob.title}
					isOpen={!!selectedJob}
					onClose={() => setSelectedJob(null)}
					onSubmit={handleSubmitApplication}
				/>
			)}
		</div>
	);
};

export default Jobs;
