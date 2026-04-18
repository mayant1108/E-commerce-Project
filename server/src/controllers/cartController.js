import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const populateCart = (query) => {
  return query.populate({
    path: "items.product",
    populate: { path: "category", select: "name slug" },
  });
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

export const getCart = asyncHandler(async (req, res) => {
  const cart = await populateCart(Cart.findOne({ user: req.user._id }));
  res.json({ cart: cart || { user: req.user._id, items: [] } });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError("Product not found", 404);
  }

  if (product.stock < 1) {
    throw new ApiError("Product is out of stock", 400);
  }

  const cart = await getOrCreateCart(req.user._id);
  const existingItem = cart.items.find((item) => String(item.product) === String(productId));
  const requestedQuantity = Math.max(Number(quantity), 1);

  if (existingItem) {
    existingItem.quantity += requestedQuantity;
  } else {
    cart.items.push({
      product: product._id,
      quantity: requestedQuantity,
      priceAtAdd: product.discountPrice || product.price,
    });
  }

  await cart.save();

  const populatedCart = await populateCart(Cart.findById(cart._id));
  res.status(201).json({ cart: populatedCart });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.find((cartItem) => String(cartItem.product) === String(req.params.productId));

  if (!item) {
    throw new ApiError("Cart item not found", 404);
  }

  if (Number(quantity) <= 0) {
    cart.items = cart.items.filter((cartItem) => String(cartItem.product) !== String(req.params.productId));
  } else {
    item.quantity = Number(quantity);
  }

  await cart.save();
  const populatedCart = await populateCart(Cart.findById(cart._id));
  res.json({ cart: populatedCart });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter((item) => String(item.product) !== String(req.params.productId));
  await cart.save();

  const populatedCart = await populateCart(Cart.findById(cart._id));
  res.json({ cart: populatedCart });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();
  res.json({ cart });
});
