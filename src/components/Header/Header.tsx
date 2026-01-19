import "./Header.scss";

const Header = () => {
  return (
    <header className="header">
      <div className="header__container">
        {/* Logo */}
        <div className="header__logo">
          <span className="header__logo-icon">💼</span>
          <span className="header__logo-text">Job Portal</span>
        </div>

        {/* Navigation */}
        <nav className="header__nav">
          <a href="/">Home</a>
          <a href="/">Jobs</a>
          <a href="/">About Us</a>
          <a href="/">Contact Us</a>
        </nav>

        {/* Auth */}
        <div className="header__auth">
          <a href="/" className="login">Login</a>
          <a href="/" className="register">Register</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
