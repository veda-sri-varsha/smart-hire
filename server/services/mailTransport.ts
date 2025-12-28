import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: process.env.BREVO_SMTP_HOST,
	port: Number(process.env.BREVO_SMTP_PORT),
	secure: false,
	auth: {
		user: process.env.BREVO_SMTP_USER,
		pass: process.env.BREVO_SMTP_PASS,
	},
});

export const sendEmail = async ({
	to,
	subject,
	html,
}: {
	to: string;
	subject: string;
	html: string;
}) => {
	await transporter.sendMail({
		from: `"${process.env.BREVO_FROM_NAME}" <${process.env.BREVO_FROM_EMAIL}>`,
		to,
		subject,
		html,
	});
};
