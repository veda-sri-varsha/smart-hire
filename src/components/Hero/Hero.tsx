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

	const DEFAULT_SKILLS = [
		"React",
		"Node.js",
		"TypeScript",
		"JavaScript",
		"Python",
		"Java",
		"AWS",
		"SQL",
		"UI/UX Design",
		"Project Management",
	];

	const locations = Array.from(
		new Set([...DEFAULT_LOCATIONS, ...(locationsData || [])]),
	);
	const skills = Array.from(
		new Set([...DEFAULT_SKILLS, ...(categoriesData || [])]),
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
							const skills = formData.get("skills")?.toString();

							const params: Record<string, string> = {};
							if (search && search.trim()) params.title = search.trim();
							if (location && location !== "Select Location")
								params.location = location;
							if (skills && skills !== "Select Skill") params.skills = skills;

							console.log("Navigating with params:", params);
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
							id="skills-select"
							title="Skills"
							name="skills"
							options={[
								{ value: "", label: "Select Skill" },
								...(skills?.map((skill) => ({ value: skill, label: skill })) ||
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
