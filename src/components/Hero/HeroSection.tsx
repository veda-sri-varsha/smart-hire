import "./HeroSection.scss";

const HeroSection = () => {
	return (
		<section className="hero">
			{/* Top Content */}
			<div className="hero-top">
				<h1>
					Good Life Begins With <br />A Good Company
				</h1>

				<p>
					Lorem ipsum dolor sit amet consectetur. Nulla ipsum cursus augue
					gravida erat nisi. Nisl mauris viverra et arcu.
				</p>

				<div className="hero-buttons">
					<button type="button" className="primary">
						Search Job
					</button>

					<button type="button" className="secondary">
						Learn more
					</button>
				</div>
			</div>

			{/* Stats */}
			<div className="hero-stats">
				<div>
					<h3>12k+</h3>
					<p>Clients worldwide</p>
				</div>
				<div>
					<h3>20k+</h3>
					<p>Active resume</p>
				</div>
				<div>
					<h3>18k+</h3>
					<p>Companies</p>
				</div>
			</div>

			{/* CTA Card */}
			<div className="hero-cta">
				<h2>Create A Better Future For Yourself</h2>
				<p>
					Lorem ipsum dolor sit amet consectetur. Nulla ipsum cursus augue
					gravida erat nisi.
				</p>
				<button type="button">Search Job</button>
			</div>
		</section>
	);
};

export default HeroSection;
