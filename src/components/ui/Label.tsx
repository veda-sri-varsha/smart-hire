import styles from "./Label.module.scss";

interface LabelProps {
	htmlFor?: string;
	children: React.ReactNode;
}

export default function Label({ htmlFor, children }: LabelProps) {
	return (
		<label htmlFor={htmlFor} className={styles.label}>
			{children}
		</label>
	);
}
