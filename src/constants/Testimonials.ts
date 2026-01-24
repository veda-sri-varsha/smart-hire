type Testimonial = {
	id: string;
	title: string;
	text: string;
	name: string;
	role: string;
};

export const testimonials: Testimonial[] = [
	{
		id: "marco-kihn",
		title: "Amazing services",
		text: "Metus faucibus sed turpis lectus feugiat tincidunt. Rhoncus sed tristique in dolor. Mus etiam et vestibulum venenatis.",
		name: "Marco Kihn",
		role: "Happy Client",
	},
	{
		id: "kristin-hester",
		title: "Everything simple",
		text: "Mus etiam et vestibulum venenatis viverra ut. Etiam morbi bibendum ullamcorper augue faucibus.",
		name: "Kristin Hester",
		role: "Happy Client",
	},
	{
		id: "zion-cisneros",
		title: "Awesome, thank you!",
		text: "Rhoncus sed tristique in dolor. Mus etiam et vestibulum venenatis viverra ut. Etiam morbi bibendum ullamcorper augue faucibus.",
		name: "Zion Cisneros",
		role: "Happy Client",
	},
];
