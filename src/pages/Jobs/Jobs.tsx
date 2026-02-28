import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { applyToJob } from "@/api/applications";
import { getJobs } from "@/api/jobs";
import ApplyModal from "@/components/ApplyModal/ApplyModal";
import JobSidebar from "@/components/JobListing/JobSidebar";
import Button from "@/components/ui/Button";
import { companiesData } from "@/constants/Jobs";
import { useAuth } from "@/context/AuthContext";
import type {
	JobFilterQuery,
	JobResponse,
} from "../../../server/types/job.types";
import "./Jobs.scss";

const Jobs = () => {
	const [filters, setFilters] = useState<JobFilterQuery>({});
	const [selectedJob, setSelectedJob] = useState<JobResponse | null>(null);
	const [appliedJobs, setAppliedJobs] = useState<string[]>(() => {
		const saved = localStorage.getItem("appliedJobs");
		return saved ? JSON.parse(saved) : [];
	});

	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	// Fetch jobs with TanStack Query
	const {
		data: jobs = [],
		isLoading,
		isError,
		error,
	} = useQuery<JobResponse[]>({
		queryKey: ["jobs", filters],
		queryFn: () => getJobs(filters).then((res) => res.jobs),
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
				<JobSidebar filters={filters} onFilterChange={setFilters} />

				<div className="jobs-page__list">
					{isLoading && <p>Loading jobs...</p>}
					{isError && (
						<p className="error-message">
							{(error as Error)?.message || "Failed to load jobs."}
						</p>
					)}
					{!isLoading && jobs.length === 0 && <p>No jobs found.</p>}

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
