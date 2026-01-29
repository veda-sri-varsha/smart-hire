import BrowseByCategory from "@/components/Category/BrowseByCategory";
import Hero from "@/components/Hero/Hero";
import HeroSection from "@/components/Hero/HeroSection";
import NewsBlog from "@/components/Hero/NewsBlog";
import RecentJobs from "@/components/JobListing/RecentJobs";
import Testimonials from "@/components/Testimonials/Testimonials";

export default function Home() {
	return (
		<>
			<Hero />
			<RecentJobs />
			<BrowseByCategory />
			<HeroSection />
			<Testimonials />
			<NewsBlog />
		</>
	);
}
