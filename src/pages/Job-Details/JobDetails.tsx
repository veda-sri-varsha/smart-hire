import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, Link } from "@tanstack/react-router";
import { useState } from "react";
import { 
	Briefcase, 
	Clock, 
	DollarSign, 
	MapPin, 
	User, 
	GraduationCap, 
	CheckCircle2,
	Facebook,
	Twitter,
	Linkedin,
	Bookmark
} from "lucide-react";

import { applyToJob, checkApplicationStatus } from "@/api/applications";
import { getJobById, getJobs } from "@/api/jobs";
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

	return (
		<div className={styles.container}>
			<div className={styles.pageBanner}>
				<h1>Job Details</h1>
			</div>

			<div className={styles.mainWrapper}>
				<div className={styles.leftColumn}>
					<div className={styles.jobHeaderCard}>
						<div className={styles.cardTop}>
							<span className={styles.timeBadge}>10 min ago</span>
							<button type="button" className={styles.bookmarkBtn}>
								<Bookmark size={24} />
							</button>
						</div>

						<div className={styles.companySection}>
							<div className={styles.companyLogo}>
								{job.company.profilePicture ? (
									<img src={job.company.profilePicture || undefined} alt={job.company.name || "Company"} />
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
						</div>

						<div className={styles.metaInfo}>
							<div className={styles.metaItem}>
								<span className={styles.icon}><Briefcase size={20} /></span>
								<span>Commerce</span>
							</div>
							<div className={styles.metaItem}>
								<span className={styles.icon}><Clock size={20} /></span>
								<span>{job.jobType.replace("_", " ")}</span>
							</div>
							<div className={styles.metaItem}>
								<span className={styles.icon}><DollarSign size={20} /></span>
								<span>${job.salaryMin}-${job.salaryMax}</span>
							</div>
							<div className={styles.metaItem}>
								<span className={styles.icon}><MapPin size={20} /></span>
								<span>{job.location}</span>
							</div>
						</div>
					</div>

					<div className={styles.contentSection}>
						<h3>Job Description</h3>
						<p>{job.description}</p>
						
						<h3>Key Responsibilities</h3>
						<ul className={styles.checkList}>
							<li><CheckCircle2 size={18} className={styles.checkIcon} /> Et nunc ut tempus duis nisl sed massa. Ornare varius faucibus nisl vitae</li>
							<li><CheckCircle2 size={18} className={styles.checkIcon} /> Cras facilisis dignissim augue lorem amet adipiscing cursus fames mauris</li>
							<li><CheckCircle2 size={18} className={styles.checkIcon} /> Ornare varius faucibus nisl vitae vitae cras ornare. Cras facilisis dignissim</li>
							<li><CheckCircle2 size={18} className={styles.checkIcon} /> Tortor amet porta proin in. Orci imperdiet nisl dignissim pellentesque</li>
						</ul>

						<h3 style={{ marginTop: '2.5rem' }}>Professional Skills</h3>
						<ul className={styles.checkList}>
							<li><CheckCircle2 size={18} className={styles.checkIcon} /> Et nunc ut tempus duis nisl sed massa. Ornare varius faucibus nisl</li>
							<li><CheckCircle2 size={18} className={styles.checkIcon} /> Ornare varius faucibus nisl vitae vitae cras ornare</li>
							<li><CheckCircle2 size={18} className={styles.checkIcon} /> Tortor amet porta proin in. Orci imperdiet nisl dignissim pellentesque</li>
						</ul>

						<h3 style={{ marginTop: '2.5rem' }}>Tags:</h3>
						<div className={styles.tags}>
							<span className={styles.tag}>Full time</span>
							<span className={styles.tag}>Commerce</span>
							<span className={styles.tag}>New - York</span>
							<span className={styles.tag}>Corporate</span>
							<span className={styles.tag}>Location</span>
						</div>

						<div className={styles.shareJob}>
							<span>Share Job:</span>
							<div className={styles.socialLinks}>
								<a href="#"><Facebook size={20} /></a>
								<a href="#"><Twitter size={20} /></a>
								<a href="#"><Linkedin size={20} /></a>
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
									<span className={styles.icon}><User size={20} /></span>
									<div>
										<p className={styles.label}>Job Title</p>
										<p className={styles.value}>{job.title}</p>
									</div>
								</div>
								<div className={styles.overviewItem}>
									<span className={styles.icon}><Clock size={20} /></span>
									<div>
										<p className={styles.label}>Job Type</p>
										<p className={styles.value}>{job.jobType.replace("_", " ")}</p>
									</div>
								</div>
								<div className={styles.overviewItem}>
									<span className={styles.icon}><Briefcase size={20} /></span>
									<div>
										<p className={styles.label}>Category</p>
										<p className={styles.value}>Commerce</p>
									</div>
								</div>
								<div className={styles.overviewItem}>
									<span className={styles.icon}><GraduationCap size={20} /></span>
									<div>
										<p className={styles.label}>Experience</p>
										<p className={styles.value}>{job.experienceMin}-{job.experienceMax} Years</p>
									</div>
								</div>
								<div className={styles.overviewItem}>
									<span className={styles.icon}><GraduationCap size={20} /></span>
									<div>
										<p className={styles.label}>Degree</p>
										<p className={styles.value}>Master</p>
									</div>
								</div>
								<div className={styles.overviewItem}>
									<span className={styles.icon}><DollarSign size={20} /></span>
									<div>
										<p className={styles.label}>Offered Salary</p>
										<p className={styles.value}>${job.salaryMin}-${job.salaryMax}</p>
									</div>
								</div>
								<div className={styles.overviewItem}>
									<span className={styles.icon}><MapPin size={20} /></span>
									<div>
										<p className={styles.label}>Location</p>
										<p className={styles.value}>{job.location}</p>
									</div>
								</div>
							</div>

							<div className={styles.mapPlaceholder} style={{ marginTop: '2rem' }}>
								{/* Map integration would go here */}
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
							<button type="submit" className={styles.sendBtn}>Send Message</button>
						</form>
					</div>
				</div>
			</div>

			<div className={styles.relatedJobs}>
				<h2>Related Jobs</h2>
				<p style={{ color: '#6b7280', marginBottom: '2rem' }}>
					At ea lobortis pretium tincidunt amet lacus ut aenean aliquet
				</p>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
					{relatedJobs?.data.slice(0, 3).map((rJob: JobResponse) => (
						<div key={rJob.id} className={styles.jobHeaderCard} style={{ padding: '1.5rem' }}>
							<div className={styles.companySection} style={{ marginBottom: '1rem' }}>
								<div className={styles.companyLogo} style={{ width: '48px', height: '48px' }}>
									{rJob.company.profilePicture ? (
										<img src={rJob.company.profilePicture || undefined} alt={rJob.company.name || "Company"} />
									) : (
										<div className={styles.logoPlaceholder}>{(rJob.company.name || "C")[0]}</div>
									)}
								</div>
								<div className={styles.jobTitleInfo}>
									<h3 style={{ fontSize: '1.25rem' }}>{rJob.title}</h3>
									<p className={styles.companyName}>{rJob.company.companyName || rJob.company.name}</p>
								</div>
								<div style={{ marginLeft: 'auto' }}>
									<Link to="/jobs/$jobId" params={{ jobId: rJob.id }}>
										<Button variant="outline">Job Details</Button>
									</Link>
								</div>
							</div>
							<div className={styles.metaInfo} style={{ gap: '1rem 2rem' }}>
								<div className={styles.metaItem} style={{ fontSize: '0.9rem' }}>
									<Briefcase size={16} /> Commerce
								</div>
								<div className={styles.metaItem} style={{ fontSize: '0.9rem' }}>
									<Clock size={16} /> {rJob.jobType.replace("_", " ")}
								</div>
								<div className={styles.metaItem} style={{ fontSize: '0.9rem' }}>
									<DollarSign size={16} /> ${rJob.salaryMin}-${rJob.salaryMax}
								</div>
								<div className={styles.metaItem} style={{ fontSize: '0.9rem' }}>
									<MapPin size={16} /> {rJob.location}
								</div>
							</div>
						</div>
					))}
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
