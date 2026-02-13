export interface Job {
	id: number;
	title: string;
	type: "Full-time" | "Part-time" | "Contract" | "Internship";
	location: string;
	salary: string;
	company: string;
	category: string;
	description: string;
	postedAt: string;
	tags?: string[];
}

export const jobsData: Job[] = [
	{
		id: 1,
		title: "Forward Security Director",
		type: "Full-time",
		location: "Seattle, WA",
		salary: "$120k - $150k",
		company: "Google",
		category: "Security",
		description: "Leading security initiatives.",
		postedAt: "2 days ago",
		tags: ["Security", "Leadership"],
	},
	{
		id: 2,
		title: "Regional Creative Facilitator",
		type: "Full-time",
		location: "Los Angeles, USA",
		salary: "$90k - $110k",
		company: "Adobe",
		category: "Creative",
		description: "Facilitating creative workshops.",
		postedAt: "5 days ago",
		tags: ["Creative", "Design"],
	},
	{
		id: 3,
		title: "Internal Integration Planner",
		type: "Full-time",
		location: "Texas, USA",
		salary: "$80k - $100k",
		company: "Oracle",
		category: "Integration",
		description: "Planning internal integrations.",
		postedAt: "1 week ago",
		tags: ["Integration", "Planning"],
	},
	{
		id: 4,
		title: "District Intranet Director",
		type: "Contract",
		location: "Florida, USA",
		salary: "$100k - $120k",
		company: "Microsoft",
		category: "IT",
		description: "Managing intranet systems.",
		postedAt: "2 weeks ago",
		tags: ["Intranet", "Management"],
	},
	{
		id: 5,
		title: "Corporate Tactics Facilitator",
		type: "Contract",
		location: "New York, USA",
		salary: "$110k - $130k",
		company: "McKinsey",
		category: "Consulting",
		description: "Facilitating corporate tactics.",
		postedAt: "3 days ago",
		tags: ["Consulting", "Strategy"],
	},
	{
		id: 6,
		title: "Forward Accounts Consultant",
		type: "Part-time",
		location: "Austin, USA",
		salary: "$60k - $80k",
		company: "Dell",
		category: "Finance",
		description: "Consulting on accounts.",
		postedAt: "1 day ago",
		tags: ["Finance", "Accounting"],
	},
];

export const companiesData = [
	{
		id: 1,
		name: "Instagram",
		logo: "/logos/instagram.png", // replace with your image path or icon
		description:
			"Elit velit mauris aliquam est diam. Leo sagittis consectetur diam morbi erat",
		openJobs: 8,
	},
	{
		id: 2,
		name: "Tesla",
		logo: "/logos/tesla.png",
		description:
			"At pellentesque amet odio cras imperdiet nisl. Ac magna aliquet massa leo",
		openJobs: 18,
	},
	{
		id: 3,
		name: "McDonald's",
		logo: "/logos/mcdonalds.png",
		description:
			"Odio aliquet tellus tellus maecenas. Faucibus in viverra venenatis phasellus",
		openJobs: 12,
	},
	{
		id: 4,
		name: "Apple",
		logo: "/logos/apple.png",
		description:
			"Et odio sem tellus ultrices posuere consequat. Tristique nascetur sapien",
		openJobs: 9,
	},
];
