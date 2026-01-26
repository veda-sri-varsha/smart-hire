import { Link } from "@tanstack/react-router";
import "./BlogCard.scss";

interface Props {
	date: string;
	title: string;
	tag: string;
}

const BlogCard = ({ date, title }: Props) => {
	return (
		<div className="blog-card">
			<span className="date">{date}</span>
			<h3>{title}</h3>
			<Link to="/">Read more →</Link>
		</div>
	);
};

export default BlogCard;
