import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";

import { applyToJob, checkApplicationStatus } from "@/api/applications";
import { getJobById } from "@/api/jobs";
import ApplyModal from "@/components/ApplyModal/ApplyModal";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/useAuth";
import type { JobResponse } from "../../../server/types/job.types";
import styles from "./JobDetails.module.scss";

export default function JobDetails() {
	const { jobId } = useParams({ from: "/jobs/$jobId" });
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const {
		data: job,
		isLoading,
		isError,
	} = useQuery<JobResponse, Error>({
		queryKey: ["job", jobId],
		queryFn: async () => {
			if (!jobId) throw new Error("Job ID missing");
			return getJobById(jobId);
		},
		enabled: !!jobId,
	});

	const { data: hasApplied } = useQuery<boolean, Error>({
		queryKey: ["applicationStatus", jobId],
		queryFn: async () => {
			if (!jobId || !isAuthenticated) return false;
			return checkApplicationStatus(jobId);
		},
		enabled: !!jobId && isAuthenticated,
	});

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

		const formData = new FormData();
		formData.append("jobId", job.id);
		formData.append("coverLetter", data.coverLetter || "");
		formData.append("resume", data.resumeFile);

		try {
			await applyToJob(formData);
			setIsModalOpen(false);
			alert("Application submitted successfully!");
		} catch (err) {
			console.error("Failed to submit application:", err);
			alert("Failed to submit application. Please try again.");
		}
	};

	if (isLoading) return <div className={styles.container}>Loading...</div>;
	if (isError || !job)
		return <div className={styles.container}>Job not found.</div>;

	return (
		<div className={styles.container}>
			<div className={styles.pageBanner}>
				<h1>Job Details</h1>
			</div>

			<div className={styles.mainContent}>
				<div className={styles.jobCard}>
					<div className={styles.cardHeader}>
						<span className={styles.timeBadge}>10 min ago</span>
						<button type="button" className={styles.bookmarkBtn}>🔖</button>
					</div>

					<div className={styles.companyLogo}>
						{job.company.profilePicture ? (
							<img src={job.company.profilePicture} alt={job.company.name || "Company"} />
						) : (
							<div className={styles.logoPlaceholder}>{(job.company.name || job.company.companyName || "C")[0]}</div>
						)}
					</div>

					<div className={styles.jobTitleInfo}>
						<h2>{job.title}</h2>
						<p className={styles.companyName}>
							{job.company.companyName || job.company.name || "Unspecified Company"}
						</p>
					</div>

					<div className={styles.metaInfo}>
						<div className={styles.metaItem}>
							<span className={styles.icon}>🏨</span>
							<span>Commerce</span>
						</div>
						<div className={styles.metaItem}>
							<span className={styles.icon}>🕒</span>
							<span>{job.jobType.replace("_", " ")}</span>
						</div>
						<div className={styles.metaItem}>
							<span className={styles.icon}>💰</span>
							<span>${job.salaryMin}-${job.salaryMax}</span>
						</div>
						<div className={styles.metaItem}>
							<span className={styles.icon}>📍</span>
							<span>{job.location}</span>
						</div>
					</div>

					<Button
						variant="primary"
						className={styles.applyBtn}
						onClick={handleApplyClick}
						disabled={hasApplied ?? false}
					>
						{hasApplied ? "Applied ✓" : "Apply Job"}
					</Button>
				</div>

				<div className={styles.overviewSection}>
					<h3>Job Overview</h3>
					<div className={styles.overviewList}>
						<div className={styles.overviewItem}>
							<span className={styles.icon}>👤</span>
							<div>
								<p className={styles.label}>Job Title</p>
								<p className={styles.value}>{job.title}</p>
							</div>
						</div>
						<div className={styles.overviewItem}>
							<span className={styles.icon}>🕒</span>
							<div>
								<p className={styles.label}>Job Type</p>
								<p className={styles.value}>{job.jobType.replace("_", " ")}</p>
							</div>
						</div>
						<div className={styles.overviewItem}>
							<span className={styles.icon}>📁</span>
							<div>
								<p className={styles.label}>Category</p>
								<p className={styles.value}>Commerce</p>
							</div>
						</div>
						<div className={styles.overviewItem}>
							<span className={styles.icon}>🎓</span>
							<div>
								<p className={styles.label}>Experience</p>
								<p className={styles.value}>{job.experienceMin}-{job.experienceMax} Years</p>
							</div>
						</div>
					</div>
				</div>

				<div className={styles.descriptionSection}>
					<h3>Description</h3>
					<p>{job.description}</p>
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
