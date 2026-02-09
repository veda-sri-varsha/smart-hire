import { JobIcon } from "../../Icons/Icons";
import "./Header.scss";
import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import MenuToggleIcon from "@/Icons/MenuToggleIcon";
import Button from "../ui/Button";

const Header = () => {
	const { location } = useRouterState();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
	const { user, isAuthenticated, logout } = useAuth();

	const isHome = location.pathname === "/";

	const getInitials = (name: string | null | undefined) => {
		if (!name) return "";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<header className={`header ${!isHome ? "header--dark" : ""}`}>
			<div className="header__container">
				<div className="header__logo">
					<span className="header__logo-icon">
						<JobIcon />
					</span>
					<span className="header__logo-text">Smart Hire</span>
				</div>

				<Button className="header__toggle" onClick={toggleMenu}>
					<MenuToggleIcon
						isOpen={isMenuOpen}
						title={isMenuOpen ? "Close menu" : "Open menu"}
					/>
				</Button>

				<nav className={`header__nav ${isMenuOpen ? "header__nav--open" : ""}`}>
					<Link to="/" onClick={() => setIsMenuOpen(false)}>
						Home
					</Link>
					<Link to="/jobs" onClick={() => setIsMenuOpen(false)}>
						Jobs
					</Link>
					<Link to="/about-us" onClick={() => setIsMenuOpen(false)}>
						About Us
					</Link>
					<Link to="/contact-us" onClick={() => setIsMenuOpen(false)}>
						Contact Us
					</Link>

					<div className="header__nav-mobile-auth">
						{isAuthenticated ? (
							<>
								<span className="header__mobile-user">
									{user?.name || "Profile"}
								</span>
								<Button
									type="button"
									onClick={() => {
										logout();
										setIsMenuOpen(false);
									}}
									className="header__mobile-logout"
								>
									Logout
								</Button>
							</>
						) : (
							<>
								<Link to="/login" onClick={() => setIsMenuOpen(false)}>
									Login
								</Link>
								<Link to="/register" onClick={() => setIsMenuOpen(false)}>
									Register
								</Link>
							</>
						)}
					</div>
				</nav>

				<div className="header__auth">
					{isAuthenticated ? (
						<div className="header__profile">
							{user?.profilePicture ? (
								<img
									src={user.profilePicture}
									alt={user.name || "Profile"}
									className="header__avatar"
								/>
							) : (
								<div className="header__avatar header__avatar--initials">
									{getInitials(user?.name)}
								</div>
							)}
							<Button
								type="button"
								onClick={logout}
								className="header__logout-btn"
							>
								Logout
							</Button>
						</div>
					) : (
						<>
							<Link to="/login" className="login">
								Login
							</Link>
							<Link to="/register" className="register">
								Register
							</Link>
						</>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
