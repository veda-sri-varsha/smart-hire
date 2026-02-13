import "./Avatar.scss";

type AvatarProps = {
	name?: string | null;
	src?: string | null;
	size?: "sm" | "md" | "lg";
};

const getInitials = (name?: string | null): string => {
	if (!name?.trim()) return "U";

	const parts = name.trim().split(/\s+/);

	if (parts.length === 1) {
		return parts[0][0].toUpperCase();
	}

	return (parts[0][0] + parts[1][0]).toUpperCase();
};

export default function Avatar({ name, src, size = "md" }: AvatarProps) {
	if (src) {
		return (
			<img
				src={src}
				alt={name || "User avatar"}
				className={`avatar avatar--${size}`}
			/>
		);
	}

	return (
		<div
			className={`avatar avatar--${size} avatar--fallback`}
			role="img"
			aria-label={name || "User avatar"}
		>
			{getInitials(name)}
		</div>
	);
}
