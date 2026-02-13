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
import JobDetails from "@/pages/Job-Details/JobDetails";
import Jobs from "@/pages/Jobs/Jobs";
import AdminDashboard from "@/pages/Admin/Dashboard";
import AdminUsers from "@/pages/Admin/Users";
import AdminJobs from "@/pages/Admin/Jobs";
import AdminSettings from "@/pages/Admin/Settings";
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

const adminRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/admin",
	component: AdminDashboard,
});

const adminUsersRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/admin/users",
	component: AdminUsers,
});

const adminJobsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/admin/jobs",
	component: AdminJobs,
});

const adminSettingsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/admin/settings",
	component: AdminSettings,
});

const routeTree = rootRoute.addChildren([
	indexRoute,
	jobsRoute,
	jobDetailsRoute,
	AboutUsRoute,
	ContactUsRoute,
	loginRoute,
	registerRoute,
	adminRoute,
	adminUsersRoute,
	adminJobsRoute,
	adminSettingsRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
