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
  const highlightChips = (product.highlights || []).slice(0, 2);

  return (
    <article className="group surface-card overflow-hidden rounded-[30px] transition duration-300 hover:-translate-y-2 hover:shadow-panel">
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
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs font-bold text-white backdrop-blur">
            {statusText}
          </span>
          <span className="rounded-full border border-white/15 bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur">
            Free delivery
          </span>
        </div>
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
        <div className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Link
            to={detailsPath}
            className="flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-black text-brand-600 shadow-lg"
          >
            View details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.26em] text-slate-400 dark:text-slate-500">
            {product.brand || "Curated label"}
          </p>
          <Link to={detailsPath}>
            <h3 className="mt-2 line-clamp-2 min-h-[52px] text-[15px] font-extrabold leading-6 text-ink transition hover:text-brand-600 dark:text-white">
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
          {highlightChips.length ? (
            highlightChips.map((highlight) => (
              <span
                key={highlight}
                className="rounded-full border border-brand-100 bg-brand-50/80 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              >
                {highlight}
              </span>
            ))
          ) : (
            <span className="rounded-full border border-brand-100 bg-brand-50/80 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              Best value find
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            {product.stock > 0 ? `${product.stock} in stock` : "In stock"}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Budget-smart choice</span>
        </div>

        <button
          type="button"
          onClick={() => addToCart(product)}
          className="button-dark flex h-11 w-full"
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
