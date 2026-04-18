import Razorpay from "razorpay";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new ApiError("Razorpay keys are not configured", 503);
  }

  if (!amount || Number(amount) <= 0) {
    throw new ApiError("Valid amount is required", 400);
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const order = await razorpay.orders.create({
    amount: Math.round(Number(amount) * 100),
    currency: "INR",
    receipt: `meesho_${Date.now()}`,
  });

  res.status(201).json({
    key: process.env.RAZORPAY_KEY_ID,
    order,
  });
});
