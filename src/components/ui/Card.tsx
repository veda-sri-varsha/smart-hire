import "./Card.scss";

interface Props {
	title: string;
	jobs: number;
	icon: string;
}

export const CategoryCard = ({ title, jobs, icon }: Props) => {
	return (
		<div className="category-card">
			<img src={`/icons/${icon}.svg`} alt={title} />
			<h3>{title}</h3>
			<span>{jobs} jobs</span>
		</div>
	);
};

export default CategoryCard;
