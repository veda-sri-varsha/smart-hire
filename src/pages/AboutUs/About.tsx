import { useState } from "react";
import "./About.scss";
import Button from "@/components/ui/Button";
import { faqs } from "@/constants/faqs";
import {
	User,
	FileText,
	Briefcase,
	CheckCircle2,
	Smile,
	FileEdit,
	Building2,
	Star,
	ArrowRight
} from "lucide-react";

export default function About() {
	const [active, setActive] = useState<string>("01");

	return (
		<div className="about-page">
			<section className="about-hero">
				<h1>About Us</h1>
			</section>

			<section className="about-intro container">
				<div className="intro-left">
					<h2>Empowering Innovation Through Modern Technology</h2>
				</div>
				<div className="intro-right">
					<p>
						We are committed to building innovative and reliable digital solutions
						that help people and businesses grow. Our focus is on creating
						user-friendly platforms, scalable applications, and modern web
						experiences that solve real-world problems.

						By combining creativity, technology, and performance-driven
						development, we aim to deliver products that are efficient,
						accessible, and designed for the future.
					</p>
				</div>
			</section>

			<section className="how-it-works container">
				<div className="how-it-works-header">
					<h2>How it works</h2>
					<p className="subtitle">
						At eu lobortis pretium tincidunt amet lacus ut aenean aliquet.
						Blandit a massa elementum id scelerisque rhoncus...
					</p>
				</div>

				<div className="steps">
					<div className="step">
						<div className="step-icon">
							<User size={32} />
						</div>
						<h4>Create Account</h4>
						<p>
							Nunc sed e nisl purus. Nibh dis faucibus proin lacus
						</p>
					</div>
					<div className="step">
						<div className="step-icon">
							<FileText size={32} />
						</div>
						<h4>Upload Resume</h4>
						<p>
							Felis eu ultrices a sed massa. Commodo fringilla sed tempor
						</p>
					</div>
					<div className="step">
						<div className="step-icon">
							<Briefcase size={32} />
						</div>
						<h4>Find Jobs</h4>
						<p>
							Commodo fringilla sed tempor risus laoreet ultricies ipsum
						</p>
					</div>
					<div className="step">
						<div className="step-icon">
							<CheckCircle2 size={32} />
						</div>
						<h4>Apply Job</h4>
						<p>
							Nisi enim feugiat enim volutpat. Sem quis viverra
						</p>
					</div>
				</div>
			</section>

			<section className="video-section container">
				<div className="video-card">
					<Button type="button" className="play-btn">
						<div className="play-icon"></div>
					</Button>
					<h2>
						Good Life Begins With
						<br />
						A Good Company
					</h2>

					<div className="video-footer">
						<div className="footer-item">
							<span className="num">1</span>
							<div className="text">
								<p>Elit gravida lorem amet porta risus vitae at</p>
								<a href="#">Learn more</a>
							</div>
						</div>
						<div className="footer-item">
							<span className="num">2</span>
							<div className="text">
								<p>Volutpat dui lacus mattis urna platea...</p>
								<a href="#">Learn more</a>
							</div>
						</div>
						<div className="footer-item">
							<span className="num">3</span>
							<div className="text">
								<p>Elementum faucibus netus gravida lacus lorem</p>
								<a href="#">Learn more</a>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="faq-section container">
				<div className="faq-header">
					<h2>Frequently Asked Questions</h2>
					<p className="subtitle">
						At eu lobortis pretium tincidunt amet lacus ut aenean aliquet
					</p>
				</div>

				<div className="faq-list">
					{faqs.map((faq) => {
						const open = active === faq.id;
						return (
							<div key={faq.id} className={`faq ${open ? "open" : ""}`}>
								<div
									className="faq-question"
									onClick={() => setActive(open ? "" : faq.id)}
								>
									<span className="num">{faq.id}</span>
									<span className="text">{faq.q}</span>
									<span className="icon">
										<div className={`icon-btn ${open ? 'open' : ''}`}>
											{open ? '×' : '+'}
										</div>
									</span>
								</div>

								{open && (
									<div className="faq-answer">
										{faq.a ||
											"Nunc sed e nisl purus. Nibh dis faucibus proin lacus tristique. Sit congue non vitae odio sit erat in. Felis eu ultrices a sed massa. Commodo fringilla sed tempor risus laoreet ultricies ipsum."}
									</div>
								)}
							</div>
						);
					})}
				</div>
			</section>

			<section className="best-section container">
				<div className="best-content">
					<div className="best-left">
						<h2>
							We're Only Working
							<br />
							With The Best
						</h2>
						<p>
							Ultricies purus dolor viverra mi laoreet at cursus justo.
							Ultrices purus diam egestas amet faucibus tempor blandit.
						</p>
						<div className="best-grid">
							<div className="best-item">
								<Smile className="icon" size={24} />
								<span>Quality Job</span>
							</div>
							<div className="best-item">
								<FileEdit className="icon" size={24} />
								<span>Resume builder</span>
							</div>
							<div className="best-item">
								<Building2 className="icon" size={24} />
								<span>Top Companies</span>
							</div>
							<div className="best-item">
								<Star className="icon" size={24} />
								<span>Top Talents</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="news-section container">
				<div className="news-header">
					<h2>News and Blog</h2>
					<p>Metus faucibus sed turpis lectus feugiat tincidunt. Rhoncus sed tristique in dolor</p>
				</div>
				<div className="news-grid">
					<div className="news-card">
						<div className="news-image news-placeholder-1">
							<span className="badge">News</span>
						</div>
						<div className="news-content">
							<span className="date">30 March 2024</span>
							<h3>Revitalizing Workplace Morale: Innovative Tactics For Boosting Employee Engagement In 2024</h3>
							<a href="#" className="read-more">
								Read more <ArrowRight size={16} />
							</a>
						</div>
					</div>
					<div className="news-card">
						<div className="news-image news-placeholder-2">
							<span className="badge">Blog</span>
						</div>
						<div className="news-content">
							<span className="date">30 March 2024</span>
							<h3>How To Avoid The Top Six Most Common Job Interview Mistakes</h3>
							<a href="#" className="read-more">
								Read more <ArrowRight size={16} />
							</a>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
