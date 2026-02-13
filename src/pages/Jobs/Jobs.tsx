import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { applyToJob } from "@/api/applications";
import { getJobs } from "@/api/jobs";
import ApplyModal from "@/components/ApplyModal/ApplyModal";
import JobSidebar from "@/components/JobListing/JobSidebar";
import { companiesData } from "@/constants/Jobs";
import { useAuth } from "@/context/AuthContext";

import type { JobFilterQuery, JobResponse } from "../../../server/types/job.types";
import "./Jobs.scss";
import Button from "@/components/ui/Button";

const Jobs = () => {
	const [jobs, setJobs] = useState<JobResponse[]>([]);
	const [filters, setFilters] = useState<JobFilterQuery>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [selectedJob, setSelectedJob] = useState<JobResponse | null>(null);
	const [appliedJobs, setAppliedJobs] = useState<string[]>([]); // track applied jobs

	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchJobs = async () => {
			try {
				const response = await getJobs(filters);
				setJobs(response.jobs);
			} catch (err) {
				console.error("Failed to fetch jobs:", err);
				setError("Failed to load jobs. Please try again later.");
			} finally {
				setLoading(false);
			}
		};
		fetchJobs();
	}, [filters]);

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
			if (!selectedJob) return;

			const formData = new FormData();
			formData.append("jobId", selectedJob.id);
			formData.append(
				"coverLetter",
				data.coverLetter || "Excited to apply for this role!",
			);
			formData.append("resume", data.resumeFile);

			await applyToJob(formData);

			setAppliedJobs([...appliedJobs, selectedJob.id]);
			alert("Application submitted successfully!");
			setSelectedJob(null);
		} catch (err: unknown) {
			console.error(err);
			let errorMessage = "Failed to submit application.";
			if (err instanceof Error) {
				errorMessage = err.message;
			} else if (typeof err === "object" && err !== null && "response" in err) {
				const response = (
					err as {
						response?: {
							data?: Record<string, unknown>;
						};
					}
				).response;
				if (response?.data?.error) {
					errorMessage = String(response.data.error);
				} else if (response?.data?.message) {
					errorMessage = String(response.data.message);
				}
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
					{loading && <p>Loading jobs...</p>}
					{error && <p className="error-message">{error}</p>}

					{!loading &&
						!error &&
						jobs.map((job) => (
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
										{job.skills.split(",").map((skill) => (
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

					{!loading && !error && jobs.length === 0 && <p>No jobs found.</p>}
				</div>
			</div>

			<section className="top-companies">
				<h2 className="top-companies__title">Top Company</h2>
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
