import "./Jobs.scss";
import { companiesData, jobsData } from "@/constants/Jobs";

const Jobs = () => {
	return (
		<div className="jobs-page">
			<h1 className="jobs-page__title">Jobs</h1>
			<div className="jobs-page__list">
				{jobsData.map((job) => (
					<div key={job.id} className="job-card">
						<h2 className="job-card__title">{job.title}</h2>
						<p className="job-card__type">{job.type}</p>
						<p className="job-card__location">{job.location}</p>
						<p className="job-card__salary">{job.salary}</p>
						<button type="button" className="job-card__apply">
							Apply
						</button>
					</div>
				))}
			</div>

			<section className="top-companies">
				<h2 className="top-companies__title">Top Company</h2>
				<p className="top-companies__subtitle">
					At eu lobortis pretium tincidunt amet lacus ut aenean aliquet. Blandit
					a massa elementum
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
							<button type="button" className="company-card__jobs">
								{company.openJobs} open jobs
							</button>
						</div>
					))}
				</div>
			</section>
		</div>
	);
};

export default Jobs;
