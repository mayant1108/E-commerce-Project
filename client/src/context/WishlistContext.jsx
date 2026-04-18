import { createContext, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { readStorage, writeStorage } from "../utils/storage";

const WishlistContext = createContext(null);
const WISHLIST_KEY = "meesho_clone_wishlist";

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState(() => readStorage(WISHLIST_KEY, []));

  const persist = (nextItems) => {
    setItems(nextItems);
    writeStorage(WISHLIST_KEY, nextItems);
  };

  const isWishlisted = (productId) => items.some((item) => item._id === productId);

  const toggleWishlist = (product) => {
    const productId = product._id || product.id;
    const exists = isWishlisted(productId);
    const nextItems = exists
      ? items.filter((item) => item._id !== productId)
      : [...items, { ...product, _id: productId }];

    persist(nextItems);
    toast.success(exists ? "Removed from wishlist" : "Added to wishlist");
  };

  const clearWishlist = () => persist([]);

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      isWishlisted,
      toggleWishlist,
      clearWishlist,
    }),
    [items]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => useContext(WishlistContext);
