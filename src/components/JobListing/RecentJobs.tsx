import { Link } from "@tanstack/react-router";
import "./RecentJobs.scss";
import { Briefcase, Clock, MapPin, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { getJobs } from "@/api/jobs";
import type { JobResponse } from "../../../server/types/job.types";

export default function RecentJobs() {
	const [jobs, setJobs] = useState<JobResponse[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchRecent = async () => {
			setIsLoading(true);
			try {
				const res = await getJobs({ limit: 4 });
				setJobs(res.data.slice(0, 4));
			} catch (error) {
				console.error("Failed to fetch recent jobs", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchRecent();
	}, []);

	return (
		<section className="recent-jobs">
			<div className="container">
				<div className="header">
					<div>
						<h2>Recent Jobs Available</h2>
						<p>
							Find the best opportunities matching your skills and career goals.
						</p>
					</div>
					<Link to="/jobs" className="view-all">
						View all
					</Link>
				</div>

				<div className="jobs-list">
					{jobs.map((job) => (
						<div className="job-card" key={job.id}>
							<span className="time">
								{new Date(job.createdAt).toLocaleDateString()}
							</span>

							<div className="job-main">
								<div className="job-info">
									<h3>{job.title}</h3>
									<p>{job.company.companyName || job.company.name}</p>

									<div className="meta">
										<div className="meta-item">
											<Briefcase size={18} />
											<span>{job.jobType.replace("_", " ")}</span>
										</div>
										<div className="meta-item">
											<Clock size={18} />
											<span>Full time</span>
										</div>
										<div className="meta-item">
											<Wallet size={18} />
											<span>
												${job.salaryMin}-${job.salaryMax}
											</span>
										</div>
										<div className="meta-item">
											<MapPin size={18} />
											<span>{job.location}</span>
										</div>
									</div>
								</div>

								<Link to="/jobs/$jobId" params={{ jobId: job.id }}>
									<button type="button" className="job-btn">
										Job Details
									</button>
								</Link>
							</div>
						</div>
					))}
					{isLoading && (
						<>
							{Array.from({ length: 4 }).map((_, i) => (
								<div key={i} className="job-skeleton-card">
									<div className="skeleton-time" />
									<div className="job-skeleton-main">
										<div className="skeleton-info">
											<div className="skeleton-title" />
											<div className="skeleton-subtitle" />
											<div className="skeleton-meta">
												<div />
												<div />
												<div />
												<div />
											</div>
										</div>
										<div className="skeleton-button" />
									</div>
								</div>
							))}
						</>
					)}
					{!isLoading && jobs.length === 0 && (
						<p className="no-jobs">No recent opportunities found.</p>
					)}
				</div>
			</div>
		</section>
	);
}
