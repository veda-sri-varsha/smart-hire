import { useState } from "react";
import "./About.scss";
import Button from "@/components/ui/Button";
import { faqs } from "@/constants/faqs";

export default function About() {
	const [active, setActive] = useState<string>("01");

	return (
		<div className="about-page">
			<section className="about-hero">
				<h1>About Smart Hire</h1>
			</section>

			<section className="about-intro container">
				<h2>Connecting Elite Talent with the Future of Work</h2>
				<p>
					At Smart Hire, we believe that everyone deserves a career they love.
					Our platform leverages advanced matching intelligence to connect
					high-potential professionals with world-class companies. We're on a
					mission to make the recruiting journey seamless, transparent, and
					rewarding for both candidates and employers.
				</p>
			</section>

			<section className="how-it-works container">
				<h2>How Smart Hire Works</h2>
				<p className="subtitle">
					Streamlined recruitment process designed for your success.
				</p>

				<div className="steps">
					<div className="step">
						<h4>Create Account</h4>
						<p>
							Build your professional profile in minutes and join our talent
							network.
						</p>
					</div>
					<div className="step">
						<h4>Upload Resume</h4>
						<p>
							Our intelligent system parses your skills to match you with top
							roles.
						</p>
					</div>
					<div className="step">
						<h4>Find Jobs</h4>
						<p>
							Explore thousands of opportunities tailored specifically to your
							career goals.
						</p>
					</div>
					<div className="step">
						<h4>Apply Job</h4>
						<p>
							Apply to your dream roles with a single click and track your
							progress live.
						</p>
					</div>
				</div>
			</section>

			<section className="video-section container">
				<div className="video-card">
					<Button type="button" className="play-btn">
						▶
					</Button>
					<h2>
						Success Begins With
						<br />
						The Right Opportunity
					</h2>

					<div className="video-footer">
						<div>
							<span>1</span> Trusted by 500+ Companies
						</div>
						<div>
							<span>2</span> 10k+ Successful Placements
						</div>
						<div>
							<span>3</span> 98% Satisfaction Rate
						</div>
					</div>
				</div>
			</section>

			<section className="faq-section container">
				<h2>Frequently Asked Questions</h2>
				<p className="subtitle">
					Everything you need to know about the Smart Hire journey.
				</p>

				<div className="faq-list">
					{faqs.map((faq) => {
						const open = active === faq.id;
						return (
							<div key={faq.id} className={`faq ${open ? "open" : ""}`}>
								<Button
									type="button"
									className="faq-question"
									onClick={() => setActive(open ? "" : faq.id)}
								>
									<span className="num">{faq.id}</span>
									<span className="text">{faq.q}</span>
									<span className="icon">{open ? "×" : "+"}</span>
								</Button>

								{open && (
									<div className="faq-answer">
										{faq.a ||
											"Our team is working on providing a detailed answer for this question. In the meantime, please contact our support for more information."}
									</div>
								)}
							</div>
						);
					})}
				</div>
			</section>

			<section className="best-section container">
				<h2>
					We Only Partner
					<br />
					With The Best
				</h2>
				<p>
					Excellence is at the core of everything we do. Join the leading job
					portal today.
				</p>

				<div className="best-points">
					<div>✓ Quality Jobs</div>
					<div>✓ Smart Matching</div>
					<div>✓ Top Companies</div>
					<div>✓ Career Support</div>
				</div>
			</section>
		</div>
	);
}
