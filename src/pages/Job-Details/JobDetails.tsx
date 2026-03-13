import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
	Bookmark,
	Briefcase,
	CheckCircle2,
	Clock,
	DollarSign,
	Facebook,
	GraduationCap,
	Linkedin,
	MapPin,
	Twitter,
	User,
} from "lucide-react";
import { useState } from "react";

import { applyToJob, checkApplicationStatus } from "@/api/applications";
import { getJobById, getJobs } from "@/api/jobs";
import ApplyModal from "@/components/ApplyModal/ApplyModal";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/useAuth";
import type { JobResponse } from "../../../server/types/job.types";
import styles from "./JobDetails.module.scss";

/**
 * Parse skills string → array of trimmed, non-empty strings.
 * Handles comma-separated values like "React, Node.js, TypeScript".
 */
function parseSkills(skills: string): string[] {
	return skills
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);
}

/**
 * Build a Google Maps embed URL from an arbitrary location string.
 * Uses the /maps/embed/v1/place API in "q" (search) mode so it works
 * without a Places API key – the free embed endpoint handles text search.
 */
function buildMapEmbedUrl(location: string): string {
	const encoded = encodeURIComponent(location);
	// Using the standard Maps embed with a text search query
	return `https://maps.google.com/maps?q=${encoded}&t=m&z=14&output=embed&iwloc=near`;
}

/**
 * Format job type enum value for display.
 * FULL_TIME → Full Time, PART_TIME → Part Time, etc.
 */
function formatJobType(jobType: string): string {
	return jobType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

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

	const { data: relatedJobs } = useQuery({
		queryKey: ["relatedJobs"],
		queryFn: () => getJobs({ limit: 3 }),
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

	// Derived dynamic data
	const skillsList = parseSkills(job.skills);
	const mapEmbedUrl = buildMapEmbedUrl(job.location);

	// Tags: job type + first 3 skills + location (city part)
	const locationCity = job.location.split(",")[0].trim();
	const tags = [
		formatJobType(job.jobType),
		...skillsList.slice(0, 3),
		locationCity,
	].filter((v, i, arr) => arr.indexOf(v) === i); // deduplicate

	// Category: use first skill as a proxy category (most descriptive)
	const category = skillsList[0] || "General";

	// Company name
	const companyDisplayName =
		job.company.companyName || job.company.name || "Unspecified Company";

	return (
		<div className={styles.container}>
			<div className={styles.pageBanner}>
				<h1>Job Details</h1>
			</div>

			<div className={styles.mainWrapper}>
				<div className={styles.leftColumn}>
					<div className={styles.jobHeaderCard}>
						<div className={styles.cardTop}>
							<span className={styles.timeBadge}>
								{new Date(job.createdAt).toLocaleDateString("en-US", {
									year: "numeric",
									month: "short",
									day: "numeric",
								})}
							</span>
							<Button
								type="button"
								className={styles.bookmarkBtn}
								variant="ghost"
							>
								<Bookmark size={24} />
							</Button>
						</div>

						<div className={styles.companySection}>
							<div className={styles.companyLogo}>
								{job.company.profilePicture ? (
									<img
										src={job.company.profilePicture}
										alt={companyDisplayName}
									/>
								) : (
									<div className={styles.logoPlaceholder}>
										{companyDisplayName[0].toUpperCase()}
									</div>
								)}
							</div>
							<div className={styles.jobTitleInfo}>
								<h2>{job.title}</h2>
								<p className={styles.companyName}>{companyDisplayName}</p>
							</div>
						</div>

						<div className={styles.metaInfo}>
							<div className={styles.metaItem}>
								<span className={styles.icon}>
									<Briefcase size={20} />
								</span>
								<span>{category}</span>
							</div>
							<div className={styles.metaItem}>
								<span className={styles.icon}>
									<Clock size={20} />
								</span>
								<span>{formatJobType(job.jobType)}</span>
							</div>
							<div className={styles.metaItem}>
								<span className={styles.icon}>
									<DollarSign size={20} />
								</span>
								<span>
									{job.salaryMin != null && job.salaryMax != null
										? `$${job.salaryMin.toLocaleString()} – $${job.salaryMax.toLocaleString()}`
										: job.salaryMin != null
											? `From $${job.salaryMin.toLocaleString()}`
											: job.salaryMax != null
												? `Up to $${job.salaryMax.toLocaleString()}`
												: "Salary not specified"}
								</span>
							</div>
							<div className={styles.metaItem}>
								<span className={styles.icon}>
									<MapPin size={20} />
								</span>
								<span>{job.location}</span>
							</div>
						</div>
					</div>

					<div className={styles.contentSection}>
						<h3>Job Description</h3>
						<p>{job.description}</p>

						{skillsList.length > 0 && (
							<>
								<h3 className={styles.marginTop}>Required Skills</h3>
								<ul className={styles.checkList}>
									{skillsList.map((skill) => (
										<li key={skill}>
											<CheckCircle2
												size={18}
												className={styles.checkIcon}
											/>
											{skill}
										</li>
									))}
								</ul>
							</>
						)}

						<h3 className={styles.marginTop}>Tags:</h3>
						<div className={styles.tags}>
							{tags.map((tag) => (
								<span key={tag} className={styles.tag}>
									{tag}
								</span>
							))}
						</div>

						<div className={styles.shareJob}>
							<span>Share Job:</span>
							<div className={styles.socialLinks}>
								<a
									href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Share on Facebook"
								>
									<Facebook size={20} />
								</a>
								<a
									href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(job.title)}`}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Share on Twitter"
								>
									<Twitter size={20} />
								</a>
								<a
									href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(job.title)}`}
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Share on LinkedIn"
								>
									<Linkedin size={20} />
								</a>
							</div>
						</div>
					</div>
				</div>

				<div className={styles.rightColumn}>
					<div className={styles.sidebarCard}>
						<Button
							variant="primary"
							className={styles.applyBtn}
							onClick={handleApplyClick}
							disabled={hasApplied ?? false}
						>
							{hasApplied ? "Applied ✓" : "Apply Job"}
						</Button>

						<div className={`${styles.sidebarCard} ${styles.overview}`}>
							<h3>Job Overview</h3>
							<div className={styles.overviewList}>
								<div className={styles.overviewItem}>
									<span className={styles.icon}>
										<User size={20} />
									</span>
									<div>
										<p className={styles.label}>Job Title</p>
										<p className={styles.value}>{job.title}</p>
									</div>
								</div>
								<div className={styles.overviewItem}>
									<span className={styles.icon}>
										<Clock size={20} />
									</span>
									<div>
										<p className={styles.label}>Job Type</p>
										<p className={styles.value}>{formatJobType(job.jobType)}</p>
									</div>
								</div>
								<div className={styles.overviewItem}>
									<span className={styles.icon}>
										<Briefcase size={20} />
									</span>
									<div>
										<p className={styles.label}>Category</p>
										<p className={styles.value}>{category}</p>
									</div>
								</div>
								{(job.experienceMin != null || job.experienceMax != null) && (
									<div className={styles.overviewItem}>
										<span className={styles.icon}>
											<GraduationCap size={20} />
										</span>
										<div>
											<p className={styles.label}>Experience</p>
											<p className={styles.value}>
												{job.experienceMin != null && job.experienceMax != null
													? `${job.experienceMin}–${job.experienceMax} Years`
													: job.experienceMin != null
														? `${job.experienceMin}+ Years`
														: `Up to ${job.experienceMax} Years`}
											</p>
										</div>
									</div>
								)}
								<div className={styles.overviewItem}>
									<span className={styles.icon}>
										<DollarSign size={20} />
									</span>
									<div>
										<p className={styles.label}>Offered Salary</p>
										<p className={styles.value}>
											{job.salaryMin != null && job.salaryMax != null
												? `$${job.salaryMin.toLocaleString()} – $${job.salaryMax.toLocaleString()}`
												: job.salaryMin != null
													? `From $${job.salaryMin.toLocaleString()}`
													: job.salaryMax != null
														? `Up to $${job.salaryMax.toLocaleString()}`
														: "Not specified"}
										</p>
									</div>
								</div>
								<div className={styles.overviewItem}>
									<span className={styles.icon}>
										<MapPin size={20} />
									</span>
									<div>
										<p className={styles.label}>Location</p>
										<p className={styles.value}>{job.location}</p>
									</div>
								</div>
							</div>

							{/* Google Maps embed using the job's actual location */}
							<div className={styles.mapWrapper}>
								<iframe
									title={`Location: ${job.location}`}
									src={mapEmbedUrl}
									width="100%"
									height="220"
									style={{ border: 0, borderRadius: "12px" }}
									allowFullScreen={false}
									loading="lazy"
									referrerPolicy="no-referrer-when-downgrade"
								/>
							</div>
						</div>
					</div>

					<div className={styles.sidebarCard}>
						<h3>Send Us Message</h3>
						<form className={styles.contactForm}>
							<input type="text" placeholder="Full name" />
							<input type="email" placeholder="Email Address" />
							<input type="tel" placeholder="Phone Number" />
							<textarea placeholder="Your Message"></textarea>
							<button type="submit" className={styles.sendBtn}>
								Send Message
							</button>
						</form>
					</div>
				</div>
			</div>

			<div className={styles.relatedJobs}>
				<h2>Related Jobs</h2>
				<div className={styles.relatedJobsHeader}>
					<p>Explore more opportunities that match your profile</p>
				</div>
				<div className={styles.relatedJobsList}>
					{relatedJobs?.data.slice(0, 3).map((rJob: JobResponse) => {
						const rCompanyName =
							rJob.company.companyName ||
							rJob.company.name ||
							"Unspecified Company";
						const rCategory = parseSkills(rJob.skills)[0] || "General";
						return (
							<div
								key={rJob.id}
								className={`${styles.jobHeaderCard} ${styles.relatedJobCard}`}
							>
								<div
									className={`${styles.companySection} ${styles.relatedJobCompany}`}
								>
									<div className={`${styles.companyLogo} ${styles.logoSmall}`}>
										{rJob.company.profilePicture ? (
											<img
												src={rJob.company.profilePicture}
												alt={rCompanyName}
											/>
										) : (
											<div className={styles.logoPlaceholder}>
												{rCompanyName[0].toUpperCase()}
											</div>
										)}
									</div>
									<div
										className={`${styles.jobTitleInfo} ${styles.jobTitleInfoSmall}`}
									>
										<h3>{rJob.title}</h3>
										<p className={styles.companyName}>{rCompanyName}</p>
									</div>
									<div className={styles.relatedJobActions}>
										<Button
											variant="outline"
											onClick={() =>
												navigate({
													to: "/jobs/$jobId",
													params: { jobId: rJob.id },
												})
											}
										>
											Job Details
										</Button>
									</div>
								</div>
								<div
									className={`${styles.metaInfo} ${styles.relatedJobMeta}`}
								>
									<div
										className={`${styles.metaItem} ${styles.metaItemSmall}`}
									>
										<Briefcase size={16} /> {rCategory}
									</div>
									<div
										className={`${styles.metaItem} ${styles.metaItemSmall}`}
									>
										<Clock size={16} /> {formatJobType(rJob.jobType)}
									</div>
									<div
										className={`${styles.metaItem} ${styles.metaItemSmall}`}
									>
										<DollarSign size={16} />
										{rJob.salaryMin != null && rJob.salaryMax != null
											? ` $${rJob.salaryMin.toLocaleString()} – $${rJob.salaryMax.toLocaleString()}`
											: " Not specified"}
									</div>
									<div
										className={`${styles.metaItem} ${styles.metaItemSmall}`}
									>
										<MapPin size={16} /> {rJob.location}
									</div>
								</div>
							</div>
						);
					})}
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
