import Product from "../models/Product.js";
import Wishlist from "../models/Wishlist.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }
  return wishlist;
};

const populateWishlist = (query) => {
  return query.populate({
    path: "products",
    populate: { path: "category", select: "name slug" },
  });
};

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await populateWishlist(Wishlist.findOne({ user: req.user._id }));
  res.json({ wishlist: wishlist || { user: req.user._id, products: [] } });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.body.productId || req.params.productId);
  if (!product) {
    throw new ApiError("Product not found", 404);
  }

  const wishlist = await getOrCreateWishlist(req.user._id);
  if (!wishlist.products.some((item) => String(item) === String(product._id))) {
    wishlist.products.push(product._id);
    await wishlist.save();
  }

  const populatedWishlist = await populateWishlist(Wishlist.findById(wishlist._id));
  res.status(201).json({ wishlist: populatedWishlist });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  wishlist.products = wishlist.products.filter((item) => String(item) !== String(req.params.productId));
  await wishlist.save();

  const populatedWishlist = await populateWishlist(Wishlist.findById(wishlist._id));
  res.json({ wishlist: populatedWishlist });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    throw new ApiError("Product not found", 404);
  }

  const wishlist = await getOrCreateWishlist(req.user._id);
  const exists = wishlist.products.some((item) => String(item) === String(product._id));

  wishlist.products = exists
    ? wishlist.products.filter((item) => String(item) !== String(product._id))
    : [...wishlist.products, product._id];

  await wishlist.save();
  const populatedWishlist = await populateWishlist(Wishlist.findById(wishlist._id));
  res.json({ wishlist: populatedWishlist, added: !exists });
});
