import { Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatCurrency, getDiscountPercent, getSellingPrice } from "../utils/formatCurrency";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const productId = product._id || product.id;
  const detailsPath = `/products/${product.slug || productId}`;
  const discount = getDiscountPercent(product);

  return (
    <article className="group overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft dark:border-white/10 dark:bg-[#191922]">
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-50 dark:bg-white/5">
        <Link to={detailsPath}>
          <img
            src={product.images?.[0] || product.image}
            alt={product.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-black text-brand-600 shadow-sm dark:bg-[#191922] dark:text-brand-300">
            {discount}% OFF
          </span>
        )}
        <button
          type="button"
          title="Wishlist"
          onClick={() => toggleWishlist(product)}
          className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm transition dark:bg-[#191922] ${
            isWishlisted(productId) ? "text-brand-500" : "text-slate-500 hover:text-brand-500"
          }`}
        >
          <Heart className="h-5 w-5" fill={isWishlisted(productId) ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="space-y-3 p-4">
        <Link to={detailsPath}>
          <h3 className="line-clamp-2 min-h-11 text-sm font-bold leading-5 text-ink transition hover:text-brand-600 dark:text-white">
            {product.title}
          </h3>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <strong className="text-lg text-ink dark:text-white">{formatCurrency(getSellingPrice(product))}</strong>
          {product.price > getSellingPrice(product) && (
            <span className="text-sm text-slate-400 line-through">{formatCurrency(product.price)}</span>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200">
            <Star className="h-3.5 w-3.5" fill="currentColor" />
            {product.rating || 4.2}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Free delivery</span>
        </div>

        <button
          type="button"
          onClick={() => addToCart(product)}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-500 text-sm font-black text-white shadow-glow transition hover:bg-brand-600"
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
