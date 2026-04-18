import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find().sort({ isFeatured: -1, name: 1 });
  res.json({ categories });
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new ApiError("Category not found", 404);
  }

  res.json({ category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const productCount = await Product.countDocuments({ category: req.params.id });
  if (productCount > 0) {
    throw new ApiError("Move products before deleting this category", 400);
  }

  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    throw new ApiError("Category not found", 404);
  }

  res.json({ message: "Category deleted" });
});
