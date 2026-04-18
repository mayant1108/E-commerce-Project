import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAdminSummary = asyncHandler(async (_req, res) => {
  const [userCount, productCount, orderCount, revenue, roleBreakdown, recentOrders] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { orderStatus: { $ne: "Cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]),
    User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
    Order.find().populate("user", "name email").sort({ createdAt: -1 }).limit(6),
  ]);

  res.json({
    stats: {
      users: userCount,
      products: productCount,
      orders: orderCount,
      revenue: revenue[0]?.total || 0,
      roles: roleBreakdown,
    },
    recentOrders,
  });
});

export const getUsers = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(),
  ]);

  res.json({
    users,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!["user", "admin", "seller"].includes(role)) {
    throw new ApiError("Invalid role", 400);
  }

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
  if (!user) {
    throw new ApiError("User not found", 404);
  }

  res.json({ user });
});
