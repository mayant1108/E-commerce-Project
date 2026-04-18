import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getSellerSummary = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user._id }).select("_id title stock discountPrice price rating");
  const productIds = products.map((product) => product._id);
  const orders = await Order.find({ "items.product": { $in: productIds } }).sort({ createdAt: -1 }).limit(8);

  const revenue = orders.reduce((sum, order) => {
    const sellerTotal = order.items
      .filter((item) => productIds.some((id) => String(id) === String(item.product)))
      .reduce((innerSum, item) => innerSum + item.price * item.quantity, 0);
    return sum + sellerTotal;
  }, 0);

  res.json({
    stats: {
      products: products.length,
      orders: orders.length,
      revenue,
      lowStock: products.filter((product) => product.stock <= 5).length,
    },
    products,
    recentOrders: orders,
  });
});

export const getSellerProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user._id })
    .populate("category", "name slug")
    .sort({ createdAt: -1 });
  res.json({ products });
});

export const getSellerOrders = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user._id }).select("_id");
  const productIds = products.map((product) => product._id);
  const orders = await Order.find({ "items.product": { $in: productIds } })
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json({ orders });
});
