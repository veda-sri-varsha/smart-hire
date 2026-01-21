import {
	createRootRoute,
	createRoute,
	createRouter,
} from "@tanstack/react-router";
import Hero from "../../components/Hero/Hero";
import MainLayout from "../../layouts/MainLayout";

const rootRoute = createRootRoute({
	component: MainLayout,
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: Hero,
});

const routeTree = rootRoute.addChildren([indexRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
