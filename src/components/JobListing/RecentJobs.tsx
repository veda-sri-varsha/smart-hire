import { Link } from "@tanstack/react-router";
import "./RecentJobs.scss";
import { useEffect, useState } from "react";
import { getJobs } from "@/api/jobs";
import type { JobResponse } from "../../../server/types/job.types";

export default function RecentJobs() {
	const [jobs, setJobs] = useState<JobResponse[]>([]);

	useEffect(() => {
		const fetchRecent = async () => {
			try {
				const data = await getJobs({ limit: 4 });
				setJobs(data.jobs.slice(0, 4));
			} catch (error) {
				console.error("Failed to fetch recent jobs", error);
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

									<ul className="meta">
										<li>{job.jobType.replace("_", " ")}</li>
										<li>${job.salaryMin}/yr</li>{" "}
										{/* Assuming annual for demo, matches Figma often */}
										<li>{job.location}</li>
									</ul>
								</div>

								<Link to="/jobs/$jobId" params={{ jobId: job.id }}>
									<button type="button" className="job-btn">
										Job Details
									</button>
								</Link>
							</div>
						</div>
					))}
					{jobs.length === 0 && (
						<p className="no-jobs">Loading recent opportunities...</p>
					)}
				</div>
			</div>
		</section>
	);
}
