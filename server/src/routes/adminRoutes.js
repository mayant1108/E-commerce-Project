import express from "express";
import { getAdminSummary, getUsers, updateUserRole } from "../controllers/adminController.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/summary", getAdminSummary);
router.get("/users", getUsers);
router.put("/users/:id/role", updateUserRole);

export default router;
