import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.scss";

type ButtonVariant = "primary" | "secondary" | "danger" | "outline" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	children: ReactNode;
	fullWidth?: boolean;
	variant?: ButtonVariant;
};

export default function Button({
	children,
	className,
	fullWidth,
	variant = "primary",
	type = "button",
	...props
}: ButtonProps) {
	return (
		<button
			type={type}
			className={[
				styles.button,
				styles[variant],
				fullWidth ? styles.fullWidth : "",
				className ?? "",
			].join(" ")}
			{...props}
		>
			{children}
		</button>
	);
}
