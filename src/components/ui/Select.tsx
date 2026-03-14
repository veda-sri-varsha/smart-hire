import type { SelectHTMLAttributes, ChangeEvent } from "react";
import { useState, useRef, useEffect } from "react";
import styles from "./Select.module.scss";

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> & {
	label?: string;
	error?: string;
	fullWidth?: boolean;
	options?: { value: string; label: string }[];
	onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
};

export default function Select({
	label,
	error,
	fullWidth,
	className,
	id,
	options,
	children,
	value,
	defaultValue,
	onChange,
	name,
	title,
	...props
}: SelectProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [internalValue, setInternalValue] = useState(value ?? defaultValue ?? "");
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (value !== undefined) {
			setInternalValue(value);
		}
	}, [value]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleOptionClick = (val: string) => {
		setInternalValue(val);
		setIsOpen(false);
		if (onChange) {
			const mockEvent = {
				target: { value: val, name: name ?? "" },
				currentTarget: { value: val, name: name ?? "" },
			} as ChangeEvent<HTMLSelectElement>;
			onChange(mockEvent);
		}
	};

	const displayLabel =
		options?.find((opt) => opt.value === internalValue)?.label ||
		title ||
		"Select...";

	return (
		<div
			ref={containerRef}
			className={`${styles.container} ${fullWidth ? styles.fullWidth : ""} ${className ?? ""}`}
		>
			{label && (
				<label htmlFor={id} className={styles.label}>
					{label}
				</label>
			)}

			<div className={styles.selectWrapper}>
				<div
					id={id}
					className={`custom-select ${styles.select} ${error ? styles.error : ""} ${isOpen ? styles.open : ""}`}
					onClick={() => setIsOpen(!isOpen)}
					{...(props as any)}
				>
					<span>{displayLabel}</span>
					<span className={`${styles.icon} ${isOpen ? styles.iconOpen : ""}`}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							width="16"
							height="16"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</span>
				</div>

				{isOpen && (
					<ul className={styles.dropdown}>
						{options ? (
							options.map((opt) => (
								<li
									key={opt.value}
									className={`${styles.option} ${internalValue === opt.value ? styles.selected : ""}`}
									onClick={() => handleOptionClick(opt.value)}
								>
									{opt.label}
								</li>
							))
						) : (
							<li className={styles.option}>No Options Available</li>
						)}
					</ul>
				)}
			</div>

			<input type="hidden" name={name} value={internalValue as string} />

			{error && <span className={styles.errorMessage}>{error}</span>}
		</div>
	);
}
