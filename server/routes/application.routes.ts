import { Router } from "express";
import {
	checkApplicationStatus,
	createApplication,
	getApplicationById,
	getJobApplicationStats,
	getJobApplications,
	getMyApplications,
	updateApplicationStatus,
	withdrawApplication,
} from "../controllers/application.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { generalRateLimiter } from "../middleware/rate-limiter.middleware";
import { authorizeRoles } from "../middleware/role.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// USER routes
router.post(
	"/",
	authorizeRoles("USER"),
	generalRateLimiter,
	upload.single("resume"),
	createApplication,
);

router.get("/my", authorizeRoles("USER"), getMyApplications);
router.get("/check/:jobId", authorizeRoles("USER"), checkApplicationStatus);
router.delete("/:id", authorizeRoles("USER"), withdrawApplication);

// COMPANY routes
router.get(
	"/job/:jobId",
	authorizeRoles("COMPANY", "HR", "ADMIN"),
	getJobApplications,
);
router.get(
	"/job/:jobId/stats",
	authorizeRoles("COMPANY", "HR", "ADMIN"),
	getJobApplicationStats,
);
router.patch(
	"/:id/status",
	authorizeRoles("COMPANY", "HR", "ADMIN"),
	updateApplicationStatus,
);

// Shared route (both USER and COMPANY can view)
router.get("/:id", getApplicationById);

export default router;
