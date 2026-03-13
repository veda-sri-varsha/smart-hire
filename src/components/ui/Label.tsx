import styles from "./Label.module.scss";

type LabelProps = {
	htmlFor?: string;
	children: React.ReactNode;
};

export default function Label({ htmlFor, children }: LabelProps) {
	return (
		<label htmlFor={htmlFor} className={styles.label}>
			{children}
		</label>
	);
}
