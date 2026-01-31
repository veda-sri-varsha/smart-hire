import {
	createRootRoute,
	createRoute,
	createRouter,
} from "@tanstack/react-router";
import AboutUs from "@/pages/AboutUs/About";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ContactUs from "@/pages/ContactUs/ContactUs";
import Home from "@/pages/Home";
import Jobs from "@/pages/Jobs/Jobs";
import JobDetails from "@/pages/Job-Details/JobDetails";
import MainLayout from "../../layouts/MainLayout";

const rootRoute = createRootRoute({
	component: MainLayout,
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: Home,
});

const jobsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/jobs",
	component: Jobs,
});

const AboutUsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/about-us",
	component: AboutUs,
});

const ContactUsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/contact-us",
	component: ContactUs,
});

const loginRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/login",
	component: Login,
});

const registerRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/register",
	component: Register,
});

const jobDetailsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/jobs/$jobId",
	component: JobDetails,
});

const routeTree = rootRoute.addChildren([
	indexRoute,
	jobsRoute,
	jobDetailsRoute,
	AboutUsRoute,
	ContactUsRoute,
	loginRoute,
	registerRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
