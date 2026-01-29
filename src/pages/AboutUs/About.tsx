import { useState } from "react";
import "./About.scss";

const faqs = [
	{
		id: "01",
		q: "Can I upload a CV?",
		a: "Nunc sed a nisl purus. Nibh dis faucibus proin lacus tristique. Sit congue non vitae odio sit erat in. Felis eu ultrices a sed massa.",
	},
	{ id: "02", q: "How long will the recruitment process take?" },
	{ id: "03", q: "What does the recruitment and selection process involve?" },
	{ id: "04", q: "Do you recruit for Graduates, Apprentices and Students?" },
	{ id: "05", q: "Can I receive notifications for future jobs?" },
];

export default function About() {
	const [active, setActive] = useState<string>("01");

	return (
		<div className="about-page">
			<section className="about-hero">
				<h1>About Us</h1>
			</section>

			<section className="about-intro container">
				<h2>Et nunc ut tempus duis nisl sed massa</h2>
				<p>
					Nunc sed a nisl purus. Nibh dis faucibus proin lacus tristique. Sit
					congue non vitae odio sit erat in. Felis eu ultrices a sed massa.
					Commodo fringilla sed tempor risus laoreet ultrices.
				</p>
			</section>

			<section className="how-it-works container">
				<h2>How it works</h2>
				<p className="subtitle">
					At eu lobortis pretium tincidunt amet lacus ut aenean aliquet.
				</p>

				<div className="steps">
					<div className="step">
						<h4>Create Account</h4>
						<p>Nunc sed a nisl purus. Nibh dis faucibus proin.</p>
					</div>
					<div className="step">
						<h4>Upload Resume</h4>
						<p>Felis eu ultrices a sed massa. Commodo.</p>
					</div>
					<div className="step">
						<h4>Find Jobs</h4>
						<p>Commodo fringilla sed tempor risus.</p>
					</div>
					<div className="step">
						<h4>Apply Job</h4>
						<p>Nisi enim feugiat enim volutpat.</p>
					</div>
				</div>
			</section>

			<section className="video-section container">
				<div className="video-card">
					<button type="button" className="play-btn">
						▶
					</button>
					<h2>
						Good Life Begins With
						<br />A Good Company
					</h2>

					<div className="video-footer">
						<div>
							<span>1</span> Elit gravida lorem amet
						</div>
						<div>
							<span>2</span> Volutpat dui lacus
						</div>
						<div>
							<span>3</span> Elementum faucibus
						</div>
					</div>
				</div>
			</section>

			<section className="faq-section container">
				<h2>Frequently Asked Questions</h2>
				<p className="subtitle">
					At eu lobortis pretium tincidunt amet lacus ut aenean aliquet.
				</p>

				<div className="faq-list">
					{faqs.map((faq) => {
						const open = active === faq.id;
						return (
							<div key={faq.id} className={`faq ${open ? "open" : ""}`}>
								<button
									type="button"
									className="faq-question"
									onClick={() => setActive(open ? "" : faq.id)}
								>
									<span className="num">{faq.id}</span>
									<span className="text">{faq.q}</span>
									<span className="icon">{open ? "×" : "+"}</span>
								</button>

								{open && faq.a && <div className="faq-answer">{faq.a}</div>}
							</div>
						);
					})}
				</div>
			</section>

			<section className="best-section container">
				<h2>
					We’re Only Working
					<br />
					With The Best
				</h2>
				<p>Ultricies purus dolor viverra mi laoreet at cursus justo.</p>

				<div className="best-points">
					<div>Quality Job</div>
					<div>Resume Builder</div>
					<div>Top Companies</div>
					<div>Top Talents</div>
				</div>
			</section>
		</div>
	);
}
