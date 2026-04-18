import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

dotenv.config();

const categorySeeds = [
  {
    name: "Ethnic Wear",
    image: "https://images.unsplash.com/photo-1610189334414-2d7f2a4f0d91?auto=format&fit=crop&w=900&q=80",
    isFeatured: true,
  },
  {
    name: "Western Wear",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
    isFeatured: true,
  },
  {
    name: "Kids",
    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=900&q=80",
    isFeatured: true,
  },
  {
    name: "Beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
    isFeatured: true,
  },
  {
    name: "Home Decor",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
    isFeatured: true,
  },
  {
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    isFeatured: false,
  },
];

const buildProducts = (categories, sellerId) => {
  const categoryMap = Object.fromEntries(categories.map((category) => [category.name, category._id]));

  return [
    {
      title: "Anaya Floral Kurti Set",
      description:
        "Soft rayon kurti set with a flattering straight fit, printed dupatta and breathable all-day comfort.",
      price: 1499,
      discountPrice: 799,
      images: [
        "https://images.unsplash.com/photo-1610189018170-5ea7110af213?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=80",
      ],
      category: categoryMap["Ethnic Wear"],
      seller: sellerId,
      stock: 42,
      rating: 4.5,
      numReviews: 184,
      brand: "Anaya",
      highlights: ["Rayon blend", "Printed dupatta", "Free delivery", "Easy returns"],
      isTrending: true,
    },
    {
      title: "Premium Georgette Saree",
      description:
        "Lightweight festive saree with woven border and smooth drape for wedding, party and gifting edits.",
      price: 2299,
      discountPrice: 999,
      images: ["https://images.unsplash.com/photo-1610030469668-8e9f641a9f34?auto=format&fit=crop&w=900&q=80"],
      category: categoryMap["Ethnic Wear"],
      seller: sellerId,
      stock: 30,
      rating: 4.6,
      numReviews: 212,
      brand: "Saheli",
      highlights: ["Georgette fabric", "Blouse piece included", "Festive ready"],
      isTrending: true,
    },
    {
      title: "Everyday Oversized Shirt",
      description: "Relaxed cotton shirt with crisp collar, premium buttons and a polished casual silhouette.",
      price: 1199,
      discountPrice: 549,
      images: ["https://images.unsplash.com/photo-1603252109360-909baaf261c7?auto=format&fit=crop&w=900&q=80"],
      category: categoryMap["Western Wear"],
      seller: sellerId,
      stock: 55,
      rating: 4.3,
      numReviews: 98,
      brand: "Urban Thread",
      highlights: ["Cotton rich", "Oversized fit", "Machine washable"],
      isTrending: true,
    },
    {
      title: "High Rise Denim Jeans",
      description: "Stretch denim jeans with clean finish, five-pocket styling and a modern tapered leg.",
      price: 1799,
      discountPrice: 899,
      images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80"],
      category: categoryMap["Western Wear"],
      seller: sellerId,
      stock: 36,
      rating: 4.4,
      numReviews: 147,
      brand: "Denim Bay",
      highlights: ["Stretch denim", "High rise", "Tapered fit"],
      isTrending: false,
    },
    {
      title: "Kids Cotton Co-ord Set",
      description: "Play-friendly cotton co-ord with cheerful print, soft seams and easy elastic waist.",
      price: 999,
      discountPrice: 449,
      images: ["https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80"],
      category: categoryMap["Kids"],
      seller: sellerId,
      stock: 72,
      rating: 4.2,
      numReviews: 73,
      brand: "TinyTales",
      highlights: ["Soft cotton", "Elastic waist", "Bright print"],
      isTrending: true,
    },
    {
      title: "Baybee Walker for Kids",
      description: "Comfortable baby walker with stable frame, playful tray and smooth movement for indoor use.",
      price: 2999,
      discountPrice: 1499,
      images: ["https://baybee.co.in/cdn/shop/files/1_39563961-6486-4b07-aefe-c2dcec52b012_500x.jpg?v=1735994785"],
      category: categoryMap["Kids"],
      seller: sellerId,
      stock: 18,
      rating: 4.3,
      numReviews: 86,
      brand: "Baybee",
      highlights: ["Stable frame", "Adjustable height", "Comfort seat"],
      isTrending: false,
    },
    {
      title: "Glow Kit Makeup Combo",
      description: "Compact makeup combo with everyday shades, satin finish and travel-friendly packaging.",
      price: 1299,
      discountPrice: 599,
      images: ["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80"],
      category: categoryMap["Beauty"],
      seller: sellerId,
      stock: 64,
      rating: 4.5,
      numReviews: 156,
      brand: "Mira Beauty",
      highlights: ["Everyday shades", "Travel pack", "Satin finish"],
      isTrending: true,
    },
    {
      title: "Ceramic Vase Set",
      description: "Two-piece ceramic vase set with matte glaze for center tables, shelves and bedroom corners.",
      price: 1499,
      discountPrice: 699,
      images: ["https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=900&q=80"],
      category: categoryMap["Home Decor"],
      seller: sellerId,
      stock: 26,
      rating: 4.4,
      numReviews: 64,
      brand: "Nest Edit",
      highlights: ["Set of 2", "Matte ceramic", "Gift ready"],
      isTrending: true,
    },
    {
      title: "Wireless Headphone Combo",
      description: "Lightweight wireless headphones with punchy bass, padded earcups and long battery backup.",
      price: 1799,
      discountPrice: 799,
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"],
      category: categoryMap["Electronics"],
      seller: sellerId,
      stock: 38,
      rating: 4.6,
      numReviews: 251,
      brand: "Beatora",
      highlights: ["Bluetooth audio", "Long battery", "Padded earcups"],
      isTrending: true,
    },
    {
      title: "Classic Smart Watch",
      description: "Smart watch with fitness tracking, crisp display and notification support for daily use.",
      price: 2499,
      discountPrice: 999,
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"],
      category: categoryMap["Electronics"],
      seller: sellerId,
      stock: 33,
      rating: 4.5,
      numReviews: 203,
      brand: "PulseOne",
      highlights: ["Fitness modes", "Notification alerts", "Water resistant"],
      isTrending: true,
    },
  ];
};

const seed = async () => {
  await connectDB();

  const upsertUser = async (userSeed) => {
    const existingUser = await User.findOne({ email: userSeed.email });
    return existingUser || User.create(userSeed);
  };

  const [admin, seller, user] = await Promise.all([
    upsertUser({ name: "Admin User", email: "admin@meesho.test", password: "Admin@123", role: "admin" }),
    upsertUser({ name: "Seller User", email: "seller@meesho.test", password: "Seller@123", role: "seller" }),
    upsertUser({ name: "Demo User", email: "user@meesho.test", password: "User@123", role: "user" }),
  ]);

  const categories = [];
  for (const categorySeed of categorySeeds) {
    let category = await Category.findOne({ name: categorySeed.name });
    if (category) {
      Object.assign(category, categorySeed);
      await category.save();
    } else {
      category = await Category.create(categorySeed);
    }
    categories.push(category);
  }

  const products = buildProducts(categories, seller._id);

  for (const product of products) {
    const existingProduct = await Product.findOne({ title: product.title });
    if (existingProduct) {
      Object.assign(existingProduct, product);
      await existingProduct.save();
    } else {
      await Product.create(product);
    }
  }

  console.log("Seed complete");
  console.table([
    { role: "admin", email: admin.email, password: "Admin@123" },
    { role: "seller", email: seller.email, password: "Seller@123" },
    { role: "user", email: user.email, password: "User@123" },
  ]);

  await mongoose.connection.close();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
