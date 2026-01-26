import { Link } from "@tanstack/react-router";
import "./RecentJobs.scss";
import { jobs } from "../../constants/JobListing";

export default function RecentJobs() {
	return (
		<section className="recent-jobs">
			<div className="container">
				<div className="header">
					<div>
						<h2>Recent Jobs Available</h2>
						<p>
							At eu lobortis pretium tincidunt amet lacus ut aenean aliquet.
						</p>
					</div>
					<Link to="/" className="view-all">
						View all
					</Link>
				</div>

				<div className="jobs-list">
					{jobs.map((job) => (
						<div className="job-card" key={job.id}>
							<span className="time">{job.time}</span>

							<div className="job-main">
								<div className="job-info">
									<h3>{job.title}</h3>
									<p>{job.company}</p>

									<ul className="meta">
										<li>{job.category}</li>
										<li>{job.type}</li>
										<li>{job.salary}</li>
										<li>{job.location}</li>
									</ul>
								</div>

								<button type="button" className="job-btn">
									Job Details
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
