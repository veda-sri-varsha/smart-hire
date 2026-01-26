type Job = {
	id: number;
	time: string;
	title: string;
	company: string;
	category: string;
	type: string;
	salary: string;
	location: string;
};

export const jobs: Job[] = [
	{
		id: 1,
		time: "10 min ago",
		title: "Forward Security Director",
		company: "Bauch, Schuppe and Schultz Co",
		category: "Hotels & Tourism",
		type: "Full time",
		salary: "$40000-$42000",
		location: "New York, USA",
	},
	{
		id: 2,
		time: "12 min ago",
		title: "Regional Creative Facilitator",
		company: "Wisozk - Becker Co",
		category: "Media",
		type: "Part time",
		salary: "$28000-$32000",
		location: "Los Angeles, USA",
	},
];
