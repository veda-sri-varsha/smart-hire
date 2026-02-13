import { useEffect, useRef, useState } from "react";
import styles from "./ApplyModal.module.scss";
import Button from "../ui/Button";
import Textarea from "../ui/Textarea";

interface ApplyModalProps {
	jobTitle: string;
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: { resumeFile: File; coverLetter?: string }) => Promise<void>;
}

export default function ApplyModal({
	jobTitle,
	isOpen,
	onClose,
	onSubmit,
}: ApplyModalProps) {
	const [resumeFile, setResumeFile] = useState<File | null>(null);
	const [coverLetter, setCoverLetter] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);

	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const modalRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!isOpen) return;

		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		const handleOutside = (e: MouseEvent) => {
			const modal = modalRef.current;
			if (modal && !modal.contains(e.target as Node)) {
				onClose();
			}
		};

		window.addEventListener("keydown", handleEsc);
		document.addEventListener("mousedown", handleOutside);
		return () => {
			window.removeEventListener("keydown", handleEsc);
			document.removeEventListener("mousedown", handleOutside);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const validateFile = (file: File) => {
		const allowedTypes = [
			"application/pdf",
			"application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		];

		if (!allowedTypes.includes(file.type)) {
			setError("Only PDF, DOC, or DOCX files are allowed");
			return false;
		}

		if (file.size > 5 * 1024 * 1024) {
			setError("Resume must be under 5MB");
			return false;
		}

		setError(null);
		return true;
	};

	const handleFileSelect = (file: File) => {
		if (validateFile(file)) {
			setResumeFile(file);
		}
	};

	const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setIsDragging(false);
		if (e.dataTransfer.files.length > 0) {
			handleFileSelect(e.dataTransfer.files[0]);
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!resumeFile) {
			setError("Resume is required");
			return;
		}

		if (coverLetter && (coverLetter.length < 10 || coverLetter.length > 2000)) {
			setError("Cover letter must be between 10 and 2000 characters");
			return;
		}

		setIsSubmitting(true);

		try {
			await onSubmit({
				resumeFile,
				coverLetter: coverLetter || undefined,
			});

			setResumeFile(null);
			setCoverLetter("");
			onClose();
		} catch (err) {
			let errorMessage = "Failed to submit application. Please try again.";

			if (err instanceof Error) {
				errorMessage = err.message;
			} else if (typeof err === "object" && err !== null && "response" in err) {
				const response = (
					err as {
						response?: {
							data?: Record<string, unknown>;
						};
					}
				).response;
				if (response?.data?.error) {
					errorMessage = String(response.data.error);
				} else if (response?.data?.message) {
					errorMessage = String(response.data.message);
				}
			}

			setError(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className={styles.backdrop}>
			<div
				ref={modalRef}
				className={styles.modal}
				role="dialog"
				aria-modal="true"
				aria-labelledby="modal-title"
			>
				<div className={styles.header}>
					<h2 id="modal-title">Apply for {jobTitle}</h2>
					<button
						type="button"
						className={styles.closeBtn}
						onClick={onClose}
						aria-label="Close modal"
					>
						&times;
					</button>
				</div>

				<form onSubmit={handleSubmit} className={styles.form}>
					{error && (
						<div className={styles.error} role="alert">
							{error}
						</div>
					)}

					{/* Resume Upload - Required */}
					<div className={styles.field}>
						<label htmlFor="resumeUpload">
							Resume <span className={styles.required}>*</span> (Required)
						</label>

						<input
							id="resumeUpload"
							type="file"
							accept=".pdf,.doc,.docx"
							hidden
							ref={fileInputRef}
							onChange={(e) =>
								e.target.files && handleFileSelect(e.target.files[0])
							}
							aria-label="Upload resume"
						/>

						<button
							type="button"
							className={`${styles.dropZone} ${isDragging ? styles.dragging : ""} ${resumeFile ? styles.filled : ""}`}
							onDrop={handleDrop}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onClick={() => fileInputRef.current?.click()}
						>
							{resumeFile ? (
								<div className={styles.fileInfo}>
									<svg
										className={styles.checkIcon}
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										aria-label="Resume uploaded"
									>
										<title>Resume uploaded successfully</title>
										<polyline points="20 6 9 17 4 12" />
									</svg>
									<span className={styles.fileName}>{resumeFile.name}</span>
									<span className={styles.fileSize}>
										({(resumeFile.size / 1024).toFixed(2)} KB)
									</span>
								</div>
							) : (
								<div className={styles.uploadPrompt}>
									<svg
										className={styles.uploadIcon}
										width="32"
										height="32"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										aria-label="Upload resume"
									>
										<title>Upload your resume file</title>
										<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
										<polyline points="17 8 12 3 7 8" />
										<line x1="12" y1="3" x2="12" y2="15" />
									</svg>
									<p className={styles.dragText}>
										<strong>Drag & drop your resume here</strong> or{" "}
										<span className={styles.clickText}>click to browse</span>
									</p>
									<p className={styles.hint}>
										Supported formats: PDF, DOC, DOCX (Max 5MB)
									</p>
								</div>
							)}
						</button>

						{resumeFile && (
							<Button
								variant="danger"
								className={styles.removeBtn}
								onClick={() => setResumeFile(null)}
							>
								Remove file
							</Button>
						)}
					</div>

					{/* Cover Letter - Optional */}
					<div className={styles.field}>
						<Textarea
							label="Cover Letter (Optional)"
							id="coverLetter"
							placeholder="Tell the employer why you're a great fit for this role..."
							value={coverLetter}
							onChange={(e) => setCoverLetter(e.target.value)}
							rows={6}
							maxLength={2000}
						/>
						<span className={styles.hint}>
							{coverLetter.length}/2000 characters
							{coverLetter.length > 0 &&
								coverLetter.length < 10 &&
								" (minimum 10 characters)"}
						</span>
					</div>

					<div className={styles.actions}>
						<Button
							variant="outline"
							className={styles.cancelBtn}
							onClick={onClose}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							variant="primary"
							className={styles.submitBtn}
							disabled={isSubmitting || !resumeFile}
						>
							{isSubmitting ? "Submitting..." : "Submit Application"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
