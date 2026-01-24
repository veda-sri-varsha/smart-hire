import { Outlet } from "@tanstack/react-router";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";

export default function MainLayout() {
	return (
		<>
			<Header />
			<Outlet />
			<Footer />
		</>
	);
}
