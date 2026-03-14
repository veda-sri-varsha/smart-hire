import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { getCategories, getLocations } from "../../api/jobs";
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
import Input from "../ui/Input";
import Select from "../ui/Select";
import styles from "./Hero.module.scss";

export default function Hero() {
	const navigate = useNavigate();

	const { data: locationsData } = useQuery({
		queryKey: ["locations"],
		queryFn: getLocations,
	});

	const { data: categoriesData } = useQuery({
		queryKey: ["categories"],
		queryFn: getCategories,
	});

	const DEFAULT_LOCATIONS = [
		"Remote",
		"Bangalore, India",
		"Hyderabad, India",
		"Delhi NCR, India",
		"Mumbai, India",
		"Chennai, India",
		"Singapore",
		"London, UK",
		"New York, USA",
	];

	const DEFAULT_CATEGORIES = [
		"Software Engineering",
		"Frontend Development",
		"Backend Development",
		"Full Stack Development",
		"Mobile App Development",
		"UI/UX Design",
		"Data Science",
		"Product Management",
		"Digital Marketing",
	];

	const locations = Array.from(
		new Set([...DEFAULT_LOCATIONS, ...(locationsData || [])]),
	);
	const categories = Array.from(
		new Set([...DEFAULT_CATEGORIES, ...(categoriesData || [])]),
	);

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
							const formData = new FormData(e.currentTarget);
							const search = formData.get("search")?.toString();
							const location = formData.get("location")?.toString();
							const category = formData.get("category")?.toString();

							const params: Record<string, string> = {};
							if (search) params.title = search;
							if (location) params.location = location;
							if (category) params.category = category;

							navigate({
								to: "/jobs",
								search: params,
							});
						}}
					>
						<Input name="search" placeholder="Job Title or Company" />
						<Select
							id="location-select"
							title="Location"
							name="location"
							options={[
								{ value: "", label: "Select Location" },
								...(locations?.map((loc) => ({ value: loc, label: loc })) ||
									[]),
							]}
						/>
						<Select
							id="category-select"
							title="Category"
							name="category"
							options={[
								{ value: "", label: "Select Category" },
								...(categories?.map((cat) => ({ value: cat, label: cat })) ||
									[]),
							]}
						/>
						<Button type="submit">
							<Search size={20} />
							<span>Search Job</span>
						</Button>
					</form>

					<div className={styles.stats}>
						<div>
							<CompanyIcon />
							<div className={styles.statText}>
								<span>25,850</span>
								<p>Jobs</p>
							</div>
						</div>
						<div>
							<UserIcon />
							<div className={styles.statText}>
								<span>10,250</span>
								<p>Candidates</p>
							</div>
						</div>
						<div>
							<CompaniesIcon />
							<div className={styles.statText}>
								<span>18,400</span>
								<p>Companies</p>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className={styles.logoStrip}>
				<div className={styles.logoContainer}>
					<div className={styles.logoTrack}>
						<Spotify />
						<SlackIcon />
						<AdobeIcon />
						<LinearIcon />
						<div className={styles.mobileOnlyLogos}>
							<Spotify />
							<SlackIcon />
							<AdobeIcon />
							<LinearIcon />
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
