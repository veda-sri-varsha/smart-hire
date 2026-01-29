import { useState } from "react";
import "./ContactUs.scss";

const ContactUs = () => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		message: "",
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		alert(`Thank you, ${formData.firstName}! Your message has been sent.`);
		setFormData({ firstName: "", lastName: "", email: "", message: "" });
	};

	return (
		<div className="contact-page">
			<div className="contact-hero">
				<h1>Contact Us</h1>
			</div>

			<div className="contact-content">
				<div className="contact-left">
					<h2>You Will Grow, You Will Succeed. We Promise That</h2>
					<p>
						Partner with us to achieve results that matter. Dedicated to
						providing solutions and excellent services.
					</p>
					<div className="contact-info">
						<div>
							<strong>Call for inquiry</strong>
							<p>+257 388-6595</p>
						</div>
						<div>
							<strong>Send us email</strong>
							<p>kramulou@sbcglobal.net</p>
						</div>
						<div>
							<strong>Opening hours</strong>
							<p>Mon - Fri: 10AM - 10PM</p>
						</div>
						<div>
							<strong>Office</strong>
							<p>19 North Road Piscataway, NY 08854</p>
						</div>
					</div>
				</div>

				<div className="contact-right">
					<div className="contact-form-card">
						<h3>Contact Info</h3>
						<form onSubmit={handleSubmit}>
							<div className="input-row">
								<input
									type="text"
									name="firstName"
									placeholder="First Name"
									value={formData.firstName}
									onChange={handleChange}
									required
								/>
								<input
									type="text"
									name="lastName"
									placeholder="Last Name"
									value={formData.lastName}
									onChange={handleChange}
									required
								/>
							</div>
							<input
								type="email"
								name="email"
								placeholder="Email Address"
								value={formData.email}
								onChange={handleChange}
								required
							/>
							<textarea
								name="message"
								placeholder="Your Message"
								value={formData.message}
								onChange={handleChange}
								rows={5}
								required
							/>
							<button type="submit">Send Message</button>
						</form>
					</div>
				</div>
			</div>

			<div className="contact-map">
				<h3>Our Location</h3>
				<iframe
					title="Office Location"
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.9999999999995!2d-74.5000000!3d40.5000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c1234567890abc%3A0x1234567890abcdef!2s19%20North%20Road%2C%20Piscataway%2C%20NY%2008854!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
					width="100%"
					height="400"
					style={{ border: 0 }}
					allowFullScreen={false}
					loading="lazy"
					referrerPolicy="no-referrer-when-downgrade"
				></iframe>
			</div>
		</div>
	);
};

export default ContactUs;
