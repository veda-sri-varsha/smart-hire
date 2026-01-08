import { Resend } from "resend";
import config from "../config/index";
import logger from "../utils/logger";

const resend = new Resend(config.RESEND_API_KEY);

export const sendVerificationOtp = async (
	email: string,
	otp: string,
	name: string,
): Promise<void> => {
	console.log("📧 Email config:", { from: config.FROM_EMAIL, to: email, otp }); // ← ADD THIS
	try {
		await resend.emails.send({
			from: config.FROM_EMAIL,
			to: email,
			subject: "Verify your email From Smart Hire",
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<h2>Welcome, ${name}!</h2>
					<p>Your verification code is:</p>
					<div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
						${otp}
					</div>
					<p>This code expires in 10 minutes.</p>
					<p>If you didn't request this, please ignore this email.</p>
				</div>
			`,
		});
		logger.info("Verification OTP sent successfully", { email });
	} catch (error) {
		logger.error("Failed to send verification OTP", { error, email });
		throw error;
	}
};

export const sendWelcomeEmail = async (
	email: string,
	name: string,
): Promise<void> => {
	try {
		await resend.emails.send({
			from: config.FROM_EMAIL,
			to: email,
			subject: "Welcome! To Smart Hire",
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<h2>Welcome aboard, ${name}! 🎉</h2>
					<p>Your email has been verified successfully.</p>
					<p>You now have full access to our platform.</p>
					<a href="${config.FRONTEND_URL}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
						Get Started
					</a>
				</div>
			`,
		});
		logger.info("Welcome email sent successfully", { email });
	} catch (error) {
		logger.error("Failed to send welcome email", { error, email });
	}
};

export const sendPasswordResetEmail = async (
	email: string,
	token: string,
	name: string,
): Promise<void> => {
	const resetLink = `${config.FRONTEND_URL}/reset-password?token=${token}`;

	try {
		await resend.emails.send({
			from: config.FROM_EMAIL,
			to: email,
			subject: "Reset your password",
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<h2>Password Reset Request</h2>
					<p>Hi ${name},</p>
					<p>We received a request to reset your password. Click the button below to create a new password:</p>
					<a href="${resetLink}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
						Reset Password
					</a>
					<p style="color: #666; font-size: 14px;">This link expires in 1 hour.</p>
					<p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
				</div>
			`,
		});
		logger.info("Password reset email sent successfully", { email });
	} catch (error) {
		logger.error("Failed to send password reset email", { error, email });
		throw error;
	}
};

export const sendPasswordChangedEmail = async (
	email: string,
	name: string,
): Promise<void> => {
	try {
		await resend.emails.send({
			from: config.FROM_EMAIL,
			to: email,
			subject: "Your password was changed",
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
					<h2>Password Changed Successfully</h2>
					<p>Hi ${name},</p>
					<p>Your password was changed successfully.</p>
					<p style="color: #dc2626; font-size: 14px;">If you didn't make this change, please contact support immediately.</p>
				</div>
			`,
		});
		logger.info("Password changed email sent successfully", { email });
	} catch (error) {
		logger.error("Failed to send password changed email", { error, email });
	}
};
