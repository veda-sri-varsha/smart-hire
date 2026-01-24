import { CompaniesIcon, CompanyIcon, UserIcon } from "../Icons";
import Button from "../ui/Button";
import styles from "./Hero.module.scss";

export default function Hero() {
	return (
		<section className={styles.hero}>
			<div className={styles.overlay} />

			<div className={styles.content}>
				<h1>Find Your Dream Job Today!</h1>
				<p>
					Connecting Talent with Opportunity: Your Gateway to Career Success
				</p>

				<div className={styles.searchBox}>
					<input placeholder="Job Title or Company" />
					<select title="Location">
						<option>Select Location</option>
					</select>
					<select title="Category">
						<option>Select Category</option>
					</select>
					<Button>
						<span>Search Job</span>
					</Button>
				</div>

				<div className={styles.stats}>
					<div>
						<CompanyIcon />
						<span>25,850</span>
						<p>Jobs</p>
					</div>
					<div>
						<UserIcon />
						<span>10,250</span>
						<p>Candidates</p>
					</div>
					<div>
						<CompaniesIcon />
						<span>18,400</span>
						<p>Companies</p>
					</div>
				</div>
			</div>
		</section>
	);
}
