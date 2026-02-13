import "./MenuToggleIcon.scss";

type MenuToggleIconProps = {
	isOpen: boolean;
	title: string;
};

export default function MenuToggleIcon({ isOpen, title }: MenuToggleIconProps) {
	return (
		<svg
			className={`menu-toggle-icon ${isOpen ? "menu-toggle-icon--open" : ""}`}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			role="img"
		>
			<title>{title}</title>
			<line x1="3" y1="6" x2="21" y2="6" />
			<line x1="3" y1="12" x2="21" y2="12" />
			<line x1="3" y1="18" x2="21" y2="18" />
		</svg>
	);
}
