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
import { jobService } from "../services/job.service";

const router = Router();

// Public routes
router.get("/", generalRateLimiter, getAllJobs);
router.get("/featured", generalRateLimiter, getFeaturedJobs);
router.get("/search", generalRateLimiter, searchJobs);
router.get("/locations", generalRateLimiter, async (_req, res) => {
	const locations = await jobService.getUniqueLocations();
	return res.json({ status: "success", data: locations });
});
router.get("/categories", generalRateLimiter, async (_req, res) => {
	const categories = await jobService.getUniqueCategories();
	return res.json({ status: "success", data: categories });
});
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

// router.get("/:id", generalRateLimiter, getJobById);

export default router;
