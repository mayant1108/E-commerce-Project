import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createOrderItems = async (items) => {
  const orderItems = [];

  for (const item of items) {
    const productId = item.product || item.productId;
    const quantity = Math.max(Number(item.quantity), 1);
    const product = await Product.findById(productId);

    if (!product) {
      throw new ApiError("One or more products no longer exist", 404);
    }

    if (product.stock < quantity) {
      throw new ApiError(`${product.title} has only ${product.stock} items in stock`, 400);
    }

    orderItems.push({
      product: product._id,
      title: product.title,
      image: product.images[0] || "",
      quantity,
      price: product.discountPrice || product.price,
    });
  }

  return orderItems;
};

export const createOrder = asyncHandler(async (req, res) => {
  const { items, paymentMethod = "COD", shippingAddress, discount = 0, razorpayOrderId, razorpayPaymentId } =
    req.body;

  let sourceItems = items;

  if (!sourceItems?.length) {
    const cart = await Cart.findOne({ user: req.user._id });
    sourceItems = cart?.items || [];
  }

  if (!sourceItems?.length) {
    throw new ApiError("No order items found", 400);
  }

  const orderItems = await createOrderItems(sourceItems);
  const itemsPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice >= 499 ? 0 : 49;
  const taxPrice = Math.round(itemsPrice * 0.05);
  const totalPrice = Math.max(itemsPrice + shippingPrice + taxPrice - Number(discount), 0);

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    paymentStatus: paymentMethod === "Razorpay" && razorpayPaymentId ? "Paid" : "Pending",
    itemsPrice,
    shippingPrice,
    taxPrice,
    discount,
    totalPrice,
    razorpayOrderId,
    razorpayPaymentId,
  });

  await Promise.all(
    orderItems.map((item) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      })
    )
  );

  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

  const populatedOrder = await Order.findById(order._id).populate("user", "name email");
  res.status(201).json({ order: populatedOrder });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ orders });
});

export const getAllOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json({ orders });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new ApiError("Order not found", 404);
  }

  order.orderStatus = req.body.orderStatus || order.orderStatus;
  order.paymentStatus = req.body.paymentStatus || order.paymentStatus;
  await order.save();

  res.json({ order });
});
