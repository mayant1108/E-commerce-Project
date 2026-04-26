import { ArrowRight, Heart, ShoppingBag, Star } from "lucide-react";
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
  const wishlisted = isWishlisted(productId);
  const statusText = product.isTrending ? "Trending pick" : product.stock <= 20 ? "Low stock" : "Ready to ship";

  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-soft transition duration-300 hover:-translate-y-2 hover:shadow-panel dark:border-white/10 dark:bg-[#171821]/90">
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-50 dark:bg-white/5">
        <Link to={detailsPath}>
          <img
            src={product.images?.[0] || product.image}
            alt={product.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
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
            wishlisted ? "text-brand-500" : "text-slate-500 hover:text-brand-500"
          }`}
        >
          <Heart className="h-5 w-5" fill={wishlisted ? "currentColor" : "none"} />
        </button>
        <div className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs font-bold text-white backdrop-blur">
          Free delivery
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.26em] text-slate-400 dark:text-slate-500">
            {product.brand || "Curated label"}
          </p>
          <Link to={detailsPath}>
            <h3 className="mt-2 line-clamp-2 min-h-[48px] text-[15px] font-extrabold leading-6 text-ink transition hover:text-brand-600 dark:text-white">
              {product.title}
            </h3>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <strong className="text-lg text-ink dark:text-white">{formatCurrency(getSellingPrice(product))}</strong>
          {product.price > getSellingPrice(product) && (
            <span className="text-sm text-slate-400 line-through">{formatCurrency(product.price)}</span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-black text-brand-600 dark:bg-brand-500/10 dark:text-brand-200">
              Save {discount}%
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200">
            <Star className="h-3.5 w-3.5" fill="currentColor" />
            {product.rating || 4.2}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{product.numReviews || 0} reviews</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {(product.highlights || []).slice(0, 2).map((highlight) => (
            <span
              key={highlight}
              className="rounded-full border border-brand-100 bg-brand-50/80 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
            >
              {highlight}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">{statusText}</span>
        </div>

        <button
          type="button"
          onClick={() => addToCart(product)}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#1f1520] text-sm font-black text-white shadow-glow transition hover:bg-brand-600 dark:bg-brand-500"
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
