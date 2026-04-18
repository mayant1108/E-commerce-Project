import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  getTrendingProducts,
  updateProduct,
} from "../controllers/productController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getProducts).post(protect, authorize("admin", "seller"), createProduct);
router.get("/trending", getTrendingProducts);
router
  .route("/:id")
  .get(getProductById)
  .put(protect, authorize("admin", "seller"), updateProduct)
  .delete(protect, authorize("admin", "seller"), deleteProduct);

export default router;
