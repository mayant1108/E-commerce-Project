import mongoose from "mongoose";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeImages = (images) => {
  if (!images) {
    return [];
  }

  if (Array.isArray(images)) {
    return images.filter(Boolean);
  }

  return String(images)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const resolveCategory = async (category) => {
  if (!category) {
    return null;
  }

  if (mongoose.Types.ObjectId.isValid(category)) {
    return category;
  }

  const categoryDoc = await Category.findOne({
    $or: [{ slug: category }, { name: new RegExp(`^${escapeRegex(category)}$`, "i") }],
  });

  return categoryDoc?._id || null;
};

export const getProducts = asyncHandler(async (req, res) => {
  const {
    category,
    maxPrice,
    minPrice,
    page = 1,
    rating,
    search,
    sort = "newest",
    limit = 12,
  } = req.query;

  const filters = {};

  if (search) {
    const searchRegex = new RegExp(escapeRegex(search), "i");
    filters.$or = [{ title: searchRegex }, { description: searchRegex }, { brand: searchRegex }];
  }

  const categoryId = await resolveCategory(category);
  if (category && !categoryId) {
    res.json({
      products: [],
      pagination: { page: Number(page), pages: 0, total: 0, limit: Number(limit) },
    });
    return;
  }

  if (categoryId) {
    filters.category = categoryId;
  }

  if (minPrice || maxPrice) {
    filters.discountPrice = {};
    if (minPrice) filters.discountPrice.$gte = Number(minPrice);
    if (maxPrice) filters.discountPrice.$lte = Number(maxPrice);
  }

  if (rating) {
    filters.rating = { $gte: Number(rating) };
  }

  const sortMap = {
    newest: { createdAt: -1 },
    price_asc: { discountPrice: 1, price: 1 },
    price_desc: { discountPrice: -1, price: -1 },
    rating: { rating: -1, numReviews: -1 },
    trending: { isTrending: -1, rating: -1 },
  };

  const pageNumber = Math.max(Number(page), 1);
  const pageSize = Math.min(Math.max(Number(limit), 1), 48);
  const skip = (pageNumber - 1) * pageSize;

  const [products, total] = await Promise.all([
    Product.find(filters)
      .populate("category", "name slug image")
      .populate("seller", "name")
      .sort(sortMap[sort] || sortMap.newest)
      .skip(skip)
      .limit(pageSize),
    Product.countDocuments(filters),
  ]);

  res.json({
    products,
    pagination: {
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
      total,
      limit: pageSize,
    },
  });
});

export const getTrendingProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isTrending: true })
    .populate("category", "name slug")
    .sort({ rating: -1, createdAt: -1 })
    .limit(Number(req.query.limit) || 8);

  res.json({ products });
});

export const getProductById = asyncHandler(async (req, res) => {
  const lookup = mongoose.Types.ObjectId.isValid(req.params.id)
    ? { _id: req.params.id }
    : { slug: req.params.id };

  const product = await Product.findOne(lookup)
    .populate("category", "name slug image")
    .populate("seller", "name role");

  if (!product) {
    throw new ApiError("Product not found", 404);
  }

  res.json({ product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const categoryId = await resolveCategory(req.body.category);
  if (!categoryId) {
    throw new ApiError("Valid category is required", 400);
  }

  const product = await Product.create({
    ...req.body,
    category: categoryId,
    images: normalizeImages(req.body.images),
    discountPrice: req.body.discountPrice || req.body.price,
    seller: req.user._id,
  });

  const populatedProduct = await Product.findById(product._id)
    .populate("category", "name slug image")
    .populate("seller", "name");

  res.status(201).json({ product: populatedProduct });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError("Product not found", 404);
  }

  if (req.user.role === "seller" && String(product.seller) !== String(req.user._id)) {
    throw new ApiError("You can update only your own products", 403);
  }

  const updates = { ...req.body };

  if (updates.category) {
    const categoryId = await resolveCategory(updates.category);
    if (!categoryId) {
      throw new ApiError("Valid category is required", 400);
    }
    updates.category = categoryId;
  }

  if (updates.images) {
    updates.images = normalizeImages(updates.images);
  }

  Object.assign(product, updates);
  await product.save();

  const updatedProduct = await Product.findById(product._id)
    .populate("category", "name slug image")
    .populate("seller", "name");

  res.json({ product: updatedProduct });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError("Product not found", 404);
  }

  if (req.user.role === "seller" && String(product.seller) !== String(req.user._id)) {
    throw new ApiError("You can delete only your own products", 403);
  }

  await product.deleteOne();
  res.json({ message: "Product deleted" });
});
