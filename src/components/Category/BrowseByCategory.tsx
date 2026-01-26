import "./BrowseByCategory.scss";
import CategoryCard from "../ui/Card";

const categories = [
	{ title: "Agriculture", jobs: 1254, icon: "agriculture" },
	{ title: "Metal Production", jobs: 816, icon: "metal" },
	{ title: "Commerce", jobs: 2082, icon: "commerce" },
	{ title: "Construction", jobs: 1520, icon: "construction" },
	{ title: "Hotels & Tourism", jobs: 1022, icon: "hotel" },
	{ title: "Education", jobs: 1496, icon: "education" },
	{ title: "Financial Services", jobs: 1529, icon: "finance" },
	{ title: "Transport", jobs: 1244, icon: "transport" },
];

const BrowseByCategory = () => {
	return (
		<section className="browse-category">
			<h2>Browse by Category</h2>
			<p className="subtitle">
				At eu lobortis pretium tincidunt amet lacus ut aenean aliquet.
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
