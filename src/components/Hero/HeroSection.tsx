import Button from "../ui/Button";
import "./HeroSection.scss";

const HeroSection = () => {
	return (
		<section className="hero">
			{/* Top Content */}
			<div className="hero-top">
				<div className="hero-top-content">
					<h1>
						Good Life Begins With <br />A Good Company
					</h1>

					<p>
						Ultricies purus dolor viverra mi laoreet at cursus justo. Ultricies
						purus diam egestas amet faucibus tempor blandit. Elit velit mauris
						aliquam est diam. Leo sagittis consectetur diam morbi erat aenean.
						Vulputate praesent congue faucibus in euismod feugiat euismod
						volutpat...
					</p>

					<div className="hero-buttons">
						<Button type="button" variant="primary">
							Search Job
						</Button>

						<Button type="button" variant="ghost" className="learn-more">
							Learn more
						</Button>
					</div>
				</div>
			</div>

			{/* Stats */}
			<div className="hero-stats">
				<div>
					<h3>12k+</h3>
					<h4>Clients worldwide</h4>
					<p>
						At eu lobortis pretium tincidunt amet lacus ut aenean aliquet.
						Blandit a massa elementum...
					</p>
				</div>
				<div>
					<h3>20k+</h3>
					<h4>Active resume</h4>
					<p>
						At eu lobortis pretium tincidunt amet lacus ut aenean aliquet.
						Blandit a massa elementum...
					</p>
				</div>
				<div>
					<h3>18k+</h3>
					<h4>Compnies</h4>
					<p>
						At eu lobortis pretium tincidunt amet lacus ut aenean aliquet.
						Blandit a massa elementum...
					</p>
				</div>
			</div>

			{/* CTA Card */}
			<div className="hero-cta">
				<div className="cta-content">
					<h2>
						Create A Better <br />
						Future For Yourself
					</h2>
					<p>
						At eu lobortis pretium tincidunt amet lacus ut aenean aliquet.
						Blandit a massa elementum id scelerisque rhoncus...
					</p>
					<Button type="button" variant="primary">
						Search Job
					</Button>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
