import {
	AdobeIcon,
	CompaniesIcon,
	CompanyIcon,
	LinearIcon,
	SlackIcon,
	Spotify,
	UserIcon,
} from "../../Icons/Icons";
import Button from "../ui/Button";
import styles from "./Hero.module.scss";

export default function Hero() {
	return (
		<>
			<section className={styles.hero}>
				<div className={styles.overlay} />

				<div className={styles.content}>
					<h1>Find Your Dream Job Today!</h1>
					<p>
						Connecting Talent with Opportunity: Your Gateway to Career Success
					</p>

					<form
						className={styles.searchBox}
						onSubmit={(e) => {
							e.preventDefault();
							const form = e.currentTarget;
							const search = (
								form.elements.namedItem("search") as HTMLInputElement
							).value;
							if (search) {
								window.location.href = `/jobs?title=${encodeURIComponent(search)}`;
							} else {
								window.location.href = `/jobs`;
							}
						}}
					>
						<input name="search" placeholder="Job Title or Company" />
						<select title="Location" name="location">
							<option value="">Select Location</option>
							<option value="New York">New York</option>
							<option value="London">London</option>
							<option value="Remote">Remote</option>
						</select>
						<select title="Category" name="category">
							<option value="">Select Category</option>
							<option value="Design">Design</option>
							<option value="Engineering">Engineering</option>
							<option value="Marketing">Marketing</option>
						</select>
						<Button type="submit">
							<span>Search Job</span>
						</Button>
					</form>

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
			<section className={styles.logoStrip}>
				<div className={styles.logoContainer}>
					<Spotify />
					<SlackIcon />
					<AdobeIcon />
					<LinearIcon />
				</div>
			</section>
		</>
	);
}
