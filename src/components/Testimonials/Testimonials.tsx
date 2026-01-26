import { testimonials } from "@/constants/Testimonials";
import styles from "./Testimonials.module.scss";

export default function Testimonials() {
	return (
		<section className={styles.testimonials}>
			<div className={styles.container}>
				<h2>Testimonials from Our Customers</h2>
				<p className={styles.subtitle}>
					At eu lobortis pretium tincidunt amet lacus ut aenean aliquet. Blandit
					a massa elementum id.
				</p>

				<div className={styles.grid}>
					{testimonials.map((item) => (
						<div key={item.id} className={styles.card}>
							<div className={styles.stars}>★★★★★</div>

							<h3>{item.title}</h3>
							<p className={styles.text}>{item.text}</p>

							<div className={styles.footer}>
								<div className={styles.avatar} />
								<div>
									<strong>{item.name}</strong>
									<span>{item.role}</span>
								</div>
								<span className={styles.quote}>“</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
