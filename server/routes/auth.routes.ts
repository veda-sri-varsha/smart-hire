import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";
import asyncHandler from "../utils/handler";

const router = Router();

router.post("/signup", asyncHandler(AuthController.signupController));
router.post("/login", asyncHandler(AuthController.loginController));
router.post(
	"/verify-email",
	asyncHandler(AuthController.verifyEmailController),
);
router.post("/resend-otp", asyncHandler(AuthController.resendOtpController));
router.post(
	"/forgot-password",
	asyncHandler(AuthController.forgotPasswordController),
);
router.post(
	"/reset-password",
	asyncHandler(AuthController.resetPasswordController),
);
router.post(
	"/change-password",
	asyncHandler(AuthController.changePasswordController),
);
router.post("/contact-us", asyncHandler(AuthController.contactUsController));

export default router;
