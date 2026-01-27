import { JobIcon } from "../Icons";
import "./Header.scss";
import { Link } from "@tanstack/react-router";

const Header = () => {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <span className="header__logo-icon">
            <JobIcon />
          </span>
          <span className="header__logo-text">Job Portal</span>
        </div>

        <nav className="header__nav">
          <Link to="/">Home</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/">About Us</Link>
          <Link to="/">Contact Us</Link>
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
