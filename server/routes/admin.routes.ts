
import { Router } from "express";
import {
    getDashboardStats,
    getAllUsers,
    getAllJobs,
    updateUserStatus,
    deleteJob
} from "../controllers/admin.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";
import { authorizeRoles } from "../middleware/role.middleware.ts";

const router = Router();

router.get(
    "/stats",
    authMiddleware,
    authorizeRoles("ADMIN"),
    getDashboardStats
);

router.get(
    "/users",
    authMiddleware,
    authorizeRoles("ADMIN"),
    getAllUsers
);

router.get(
    "/jobs",
    authMiddleware,
    authorizeRoles("ADMIN"),
    getAllJobs
);

router.patch(
    "/users/:id",
    authMiddleware,
    authorizeRoles("ADMIN"),
    updateUserStatus
);

router.delete(
    "/jobs/:id",
    authMiddleware,
    authorizeRoles("ADMIN"),
    deleteJob
);

export default router;
