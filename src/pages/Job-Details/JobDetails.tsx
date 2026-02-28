import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { applyToJob, checkApplicationStatus } from "@/api/applications";
import { getJobById } from "@/api/jobs";
import ApplyModal from "@/components/ApplyModal/ApplyModal";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import type { JobResponse } from "../../../server/types/job.types";
import styles from "./JobDetails.module.scss";

export default function JobDetails() {
	const { jobId } = useParams({ from: "/jobs/$jobId" });
	const [job, setJob] = useState<JobResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [applyStatus, setApplyStatus] = useState<"idle" | "success" | "error">(
		"idle",
	);

	useEffect(() => {
		const fetchJob = async () => {
			if (!jobId) return;
			try {
				const data = await getJobById(jobId);
				setJob(data);
			} catch (err) {
				console.error("Failed to fetch job details:", err);
				setError("Failed to load job details.");
			} finally {
				setLoading(false);
			}
		};

		fetchJob();
	}, [jobId]);

	useEffect(() => {
		const checkStatus = async () => {
			if (!jobId || !isAuthenticated) return;
			try {
				const hasApplied = await checkApplicationStatus(jobId);
				if (hasApplied) {
					setApplyStatus("success");
				}
			} catch (err) {
				console.error("Failed to check application status", err);
			}
		};
		checkStatus();
	}, [jobId, isAuthenticated]);

	const handleApplyClick = () => {
		if (!isAuthenticated) {
			navigate({ to: "/login" });
			return;
		}
		setIsModalOpen(true);
	};

	const handleSubmitApplication = async (data: {
		resumeFile: File;
		coverLetter?: string;
	}) => {
		if (!job) return;

		try {
			const formData = new FormData();
			formData.append("jobId", job.id);
			formData.append("coverLetter", data.coverLetter || "");
			formData.append("resume", data.resumeFile);

			await applyToJob(formData);

			setApplyStatus("success");
			setIsModalOpen(false);
		} catch (err) {
			console.error("Failed to submit application:", err);
			throw err;
		}
	};

	if (loading) return <div className={styles.container}>Loading...</div>;
	if (error || !job)
		return <div className={styles.container}>{error || "Job not found"}</div>;

	return (
		<div className={styles.container}>
			<div className={styles.pageBanner}>
				<h1>Job Details</h1>
			</div>
			<div className={styles.mainContent}>
				<div className={styles.header}>
					<div className={styles.headerContent}>
						<h1>{job.title}</h1>
						<div className={styles.meta}>
							<span className={styles.type}>
								{job.jobType.replace("_", " ")}
							</span>
							<span className={styles.salary}>
								${job.salaryMin} - ${job.salaryMax}
							</span>
							<span className={styles.location}>{job.location}</span>
						</div>
					</div>
					<Button
						variant="primary"
						className={styles.applyBtn}
						onClick={handleApplyClick}
						disabled={applyStatus === "success"}
					>
						{applyStatus === "success" ? "Applied ✓" : "Apply Now"}
					</Button>
				</div>

				<div className={styles.content}>
					<section>
						<h2>Description</h2>
						<p>{job.description}</p>
					</section>

					<section>
						<h2>Details</h2>
						<ul>
							<li>
								<strong>Company:</strong>{" "}
								{job.company.companyName || job.company.name || "N/A"}
							</li>
							<li>
								<strong>Experience:</strong> {job.experienceMin} -{" "}
								{job.experienceMax} years
							</li>
							<li>
								<strong>Posted:</strong>{" "}
								{new Date(job.createdAt).toLocaleDateString()}
							</li>
						</ul>
					</section>

					<section>
						<h2>Skills</h2>
						<ul>
							{job.skills.split(",").map((skill) => (
								<li key={skill}>{skill.trim()}</li>
							))}
						</ul>
					</section>
				</div>
			</div>

			<ApplyModal
				jobTitle={job.title}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleSubmitApplication}
			/>
		</div>
	);
}
