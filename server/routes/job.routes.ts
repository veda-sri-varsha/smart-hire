import { Router } from "express";
import {
	createJob,
	deleteJob,
	getAllJobs,
	getFeaturedJobs,
	getJobById,
	getMyJobs,
	searchJobs,
	updateJob,
	updateJobStatus,
} from "../controllers/job.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { generalRateLimiter } from "../middleware/rate-limiter.middleware";
import { authorizeRoles } from "../middleware/role.middleware";

const router = Router();

// Public routes
router.get("/", generalRateLimiter, getAllJobs);
router.get("/featured", generalRateLimiter, getFeaturedJobs);
router.get("/search", generalRateLimiter, searchJobs);
router.get("/:id", generalRateLimiter, getJobById);

// Protected routes (COMPANY / HR / ADMIN)
router.post(
	"/",
	authMiddleware,
	authorizeRoles("COMPANY", "HR", "ADMIN"),
	createJob,
);

router.get(
	"/my/jobs",
	authMiddleware,
	authorizeRoles("COMPANY", "HR", "ADMIN"),
	getMyJobs,
);

router.put(
	"/:id",
	authMiddleware,
	authorizeRoles("COMPANY", "HR", "ADMIN"),
	updateJob,
);

router.patch(
	"/:id/status",
	authMiddleware,
	authorizeRoles("COMPANY", "HR", "ADMIN"),
	updateJobStatus,
);

router.delete(
	"/:id",
	authMiddleware,
	authorizeRoles("COMPANY", "HR", "ADMIN"),
	deleteJob,
);

export default router;
