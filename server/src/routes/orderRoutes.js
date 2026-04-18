import express from "express";
import { createOrder, getAllOrders, getMyOrders, updateOrderStatus } from "../controllers/orderController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createOrder).get(protect, authorize("admin"), getAllOrders);
router.get("/mine", protect, getMyOrders);
router.put("/:id/status", protect, authorize("admin", "seller"), updateOrderStatus);

export default router;
