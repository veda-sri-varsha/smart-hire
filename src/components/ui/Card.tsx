import type { LucideIcon } from "lucide-react";
import "./Card.scss";

interface Props {
	title: string;
	jobs: number;
	icon: LucideIcon;
}

export const CategoryCard = ({ title, jobs, icon: Icon }: Props) => {
	return (
		<div className="category-card">
			<div className="icon-wrapper">
				<Icon size={32} />
			</div>
			<h3>{title}</h3>
			<span>{jobs} jobs</span>
		</div>
	);
};

export default CategoryCard;
