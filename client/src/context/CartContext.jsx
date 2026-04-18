import { createContext, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getSellingPrice } from "../utils/formatCurrency";
import { readStorage, writeStorage } from "../utils/storage";

const CartContext = createContext(null);
const CART_KEY = "meesho_clone_cart";

const normalizeProduct = (product) => ({
  _id: product._id || product.id,
  slug: product.slug,
  title: product.title,
  price: product.price,
  discountPrice: product.discountPrice,
  image: product.image || product.images?.[0],
  images: product.images,
  stock: product.stock,
  category: product.category,
});

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => readStorage(CART_KEY, []));

  const persist = (nextItems) => {
    setItems(nextItems);
    writeStorage(CART_KEY, nextItems);
  };

  const addToCart = (product, quantity = 1) => {
    const normalizedProduct = normalizeProduct(product);
    const nextItems = items.some((item) => item.product._id === normalizedProduct._id)
      ? items.map((item) =>
          item.product._id === normalizedProduct._id
            ? { ...item, quantity: item.quantity + Number(quantity) }
            : item
        )
      : [...items, { product: normalizedProduct, quantity: Number(quantity) }];

    persist(nextItems);
    toast.success("Added to cart");
  };

  const updateQuantity = (productId, quantity) => {
    if (Number(quantity) <= 0) {
      removeFromCart(productId);
      return;
    }

    persist(items.map((item) => (item.product._id === productId ? { ...item, quantity: Number(quantity) } : item)));
  };

  const removeFromCart = (productId) => {
    persist(items.filter((item) => item.product._id !== productId));
    toast.success("Removed from cart");
  };

  const clearCart = () => persist([]);

  const subtotal = items.reduce((sum, item) => sum + getSellingPrice(item.product) * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= 499 ? 0 : 49;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      shipping,
      tax,
      total,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    }),
    [items, subtotal, shipping, tax, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
