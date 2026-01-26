import "./NewsBlog.scss";
import { Link } from "@tanstack/react-router";
import BlogCard from "../ui/BlogCard";

const blogs = [
	{
		id: "blog-1",
		date: "30 March 2024",
		title:
			"Revitalizing Workplace Morale: Innovative Tactics For Boosting Employee Engagement In 2024",
		tag: "News",
	},
	{
		id: "blog-2",
		date: "30 March 2024",
		title: "How To Avoid The Top Six Most Common Job Interview Mistakes",
		tag: "Blog",
	},
];

const NewsBlog = () => {
	return (
		<section className="news-blog">
			{/* Header */}
			<div className="header">
				<div>
					<h2>News and Blog</h2>
					<p>
						Metus faucibus sed turpis lectus feugiat tincidunt. Rhoncus sed
						tristique in dolor.
					</p>
				</div>

				<Link to="/" className="view-all">
					View all
				</Link>
			</div>

			{/* Tags */}
			<div className="tags">
				<span>News</span>
				<span>Blog</span>
			</div>

			{/* Blog Cards */}
			<div className="blog-grid">
				{blogs.map((blog) => (
					<BlogCard key={blog.id} {...blog} />
				))}
			</div>
		</section>
	);
};

export default NewsBlog;
