import { Briefcase } from "lucide-react";

const Header = () => {
	return (
		<header className="bg-gray-800 text-white">
			<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
				<div className="flex items-center gap-2 text-xl font-bold">
					<Briefcase className="h-6 w-6 text-teal-400" />
					<span>Smart-Hire</span>
				</div>

				<nav className="hidden md:flex gap-8 text-sm">
					<a href="/" className="hover:text-teal-400 transition">
						Home
					</a>
					<a href="/jobs" className="hover:text-teal-400 transition">
						Jobs
					</a>
					<a href="/about" className="hover:text-teal-400 transition">
						About Us
					</a>
					<a href="/contact" className="hover:text-teal-400 transition">
						Contact
					</a>
				</nav>

				<div className="flex items-center gap-4 text-sm">
					<a href="/login" className="hover:text-teal-400 transition">
						Login
					</a>
					<a
						href="/register"
						className="bg-teal-500 hover:bg-teal-600 px-4 py-1.5 rounded transition"
					>
						Register
					</a>
				</div>
			</div>
		</header>
	);
};

export default Header;
