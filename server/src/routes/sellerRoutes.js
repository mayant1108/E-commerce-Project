import express from "express";
import { getSellerOrders, getSellerProducts, getSellerSummary } from "../controllers/sellerController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("seller", "admin"));

router.get("/summary", getSellerSummary);
router.get("/products", getSellerProducts);
router.get("/orders", getSellerOrders);

export default router;
