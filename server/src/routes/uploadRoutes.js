import express from "express";
import { uploadImage } from "../controllers/uploadController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/image", protect, authorize("admin", "seller"), upload.single("image"), uploadImage);

export default router;
