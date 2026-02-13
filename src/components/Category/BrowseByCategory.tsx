import {
	Wheat,
	Factory,
	ShoppingBag,
	HardHat,
	Hotel,
	GraduationCap,
	Banknote,
	Truck
} from "lucide-react";
import "./BrowseByCategory.scss";
import CategoryCard from "../ui/Card";

const categories = [
	{ title: "Agriculture", jobs: 1254, icon: Wheat },
	{ title: "Metal Production", jobs: 816, icon: Factory },
	{ title: "Commerce", jobs: 2082, icon: ShoppingBag },
	{ title: "Construction", jobs: 1520, icon: HardHat },
	{ title: "Hotels & Tourism", jobs: 1022, icon: Hotel },
	{ title: "Education", jobs: 1496, icon: GraduationCap },
	{ title: "Financial Services", jobs: 1529, icon: Banknote },
	{ title: "Transport", jobs: 1244, icon: Truck },
];

const BrowseByCategory = () => {
	return (
		<section className="browse-category">
			<h2>Browse by Category</h2>
			<p className="subtitle">
				Explore thousands of job opportunities across diverse industry sectors and find your next career move.
			</p>

			<div className="grid">
				{categories.map((cat) => (
					<CategoryCard key={cat.title} {...cat} />
				))}
			</div>
		</section>
	);
};

export default BrowseByCategory;
