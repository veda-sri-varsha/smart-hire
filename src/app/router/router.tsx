import {
	createRootRoute,
	createRoute,
	createRouter,
} from "@tanstack/react-router";
import Home from "@/pages/Home";
import Jobs from "@/pages/Jobs/Jobs";
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

const routeTree = rootRoute.addChildren([indexRoute, jobsRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
