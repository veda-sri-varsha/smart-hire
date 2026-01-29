import { JobIcon } from "../Icons";
import "./Header.scss";
import { Link, useRouterState } from "@tanstack/react-router";

const Header = () => {
	const { location } = useRouterState();

	const isHome = location.pathname === "/";
	return (
		<header className={`header ${!isHome ? "header--dark" : ""}`}>
			<div className="header__container">
				<div className="header__logo">
					<span className="header__logo-icon">
						<JobIcon />
					</span>
					<span className="header__logo-text">Smart Hire</span>
				</div>

				<nav className="header__nav">
					<Link to="/">Home</Link>
					<Link to="/jobs">Jobs</Link>
					<Link to="/about-us">About Us</Link>
					<Link to="/contact-us">Contact Us</Link>
				</nav>

				<div className="header__auth">
					<Link to="/" className="login">
						Login
					</Link>
					<Link to="/" className="register">
						Register
					</Link>
				</div>
			</div>
		</header>
	);
};

export default Header;
