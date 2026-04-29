import { useEffect, useMemo, useState } from "react";
import { Heart, ShieldCheck, ShoppingBag, Sparkles, Star, Truck } from "lucide-react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import EmptyState from "../components/EmptyState";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import SkeletonCard from "../components/SkeletonCard";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { getFallbackProduct, products as fallbackProducts } from "../data/mockData";
import { formatCurrency, getDiscountPercent, getSellingPrice } from "../utils/formatCurrency";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
        setSelectedImage(data.product.images?.[0]);
      } catch {
        const fallbackProduct = getFallbackProduct(id);
        setProduct(fallbackProduct || null);
        setSelectedImage(fallbackProduct?.images?.[0] || "");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const categorySlug = product.category?.slug || product.category?.name;
    return fallbackProducts
      .filter((item) => item._id !== product._id && (item.category?.slug === categorySlug || item.category?.name === categorySlug))
      .slice(0, 4);
  }, [product]);

  if (loading) {
    return (
      <section className="container-shell grid gap-8 py-10 lg:grid-cols-[1fr_1fr]">
        <div className="skeleton aspect-square animate-shimmer rounded-[28px]" />
        <div className="space-y-4">
          <div className="skeleton h-10 w-3/4 animate-shimmer rounded-full" />
          <div className="skeleton h-5 w-1/2 animate-shimmer rounded-full" />
          <div className="skeleton h-28 w-full animate-shimmer rounded-2xl" />
          <div className="skeleton h-12 w-64 animate-shimmer rounded-full" />
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="container-shell py-12">
        <EmptyState title="Product not found" message="The item may be unavailable now." />
      </section>
    );
  }

  const discount = getDiscountPercent(product);
  const productId = product._id || product.id;

  return (
    <>
      <section className="container-shell grid gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-4 md:grid-cols-[96px_1fr]">
          <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col">
            {product.images?.map((image) => (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedImage(image)}
                className={`h-24 w-24 shrink-0 overflow-hidden rounded-[22px] border bg-white p-1 ${
                  selectedImage === image ? "border-brand-500 shadow-soft" : "border-brand-100 dark:border-white/10"
                }`}
              >
                <img src={image} alt={product.title} className="h-full w-full rounded-xl object-cover" />
              </button>
            ))}
          </div>
          <div className="surface-card order-1 relative overflow-hidden rounded-[32px] md:order-2">
            <img src={selectedImage || product.images?.[0]} alt={product.title} className="aspect-square h-full w-full object-cover" />
            <div className="absolute inset-x-4 bottom-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[22px] border border-white/15 bg-black/35 p-4 text-white backdrop-blur">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-200">Quick promise</p>
                <p className="mt-2 text-sm leading-6 text-white/78">Cleaner product scans, visible discounts and simpler decision-making.</p>
              </div>
              <div className="rounded-[22px] border border-white/15 bg-white/15 p-4 text-white backdrop-blur">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-100">Category match</p>
                <p className="mt-2 text-sm font-bold">{product.category?.name || product.category?.slug || "Curated collection"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="premium-card rounded-[28px] p-6 md:p-8">
          <span className="section-chip">{product.brand || "Curated label"}</span>
          <h1 className="mt-3 text-3xl font-black leading-tight text-ink dark:text-white sm:text-4xl">{product.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-black text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200">
              <Star className="h-4 w-4" fill="currentColor" />
              {product.rating}
            </span>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{product.numReviews || 0} reviews</span>
            {discount > 0 && (
              <span className="rounded-full bg-brand-50 px-3 py-1.5 text-sm font-black text-brand-600 dark:bg-brand-500/15 dark:text-brand-200">
                {discount}% off
              </span>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-end gap-3">
            <strong className="text-4xl font-black text-ink dark:text-white">{formatCurrency(getSellingPrice(product))}</strong>
            {product.price > getSellingPrice(product) && (
              <span className="pb-1 text-lg text-slate-400 line-through">{formatCurrency(product.price)}</span>
            )}
          </div>

          <p className="mt-5 leading-7 text-slate-600 dark:text-slate-300">{product.description}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[24px] border border-brand-100 bg-brand-50/70 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-2 text-sm font-black text-brand-700 dark:text-brand-200">
                <Truck className="h-4 w-4" />
                Dispatch ready
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Fast-moving catalogue pick with delivery clarity upfront.</p>
            </div>
            <div className="rounded-[24px] border border-white/60 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-2 text-sm font-black text-ink dark:text-white">
                <ShieldCheck className="h-4 w-4 text-brand-500" />
                Protected checkout
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Secure payment flow and visible final pricing.</p>
            </div>
            <div className="rounded-[24px] border border-white/60 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-2 text-sm font-black text-ink dark:text-white">
                <Sparkles className="h-4 w-4 text-brand-500" />
                Curated details
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Highlights and reviews are surfaced before the add-to-cart step.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {product.highlights?.map((highlight) => (
              <div key={highlight} className="rounded-2xl bg-brand-50 px-4 py-3 text-sm font-bold text-brand-700 dark:bg-white/5 dark:text-brand-200">
                {highlight}
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="button-primary flex h-12 px-6"
            >
              <ShoppingBag className="h-5 w-5" />
              Add to Cart
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className="button-secondary flex h-12 px-6"
            >
              <Heart className="h-5 w-5" fill={isWishlisted(productId) ? "currentColor" : "none"} />
              Wishlist
            </button>
          </div>

          <div className="mt-8 grid gap-4 text-sm font-bold text-slate-600 dark:text-slate-300 sm:grid-cols-2">
            <span className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-brand-500" />
              Free delivery above Rs. 499
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand-500" />
              Secure checkout
            </span>
          </div>
        </div>
      </section>

      <section className="container-shell py-8">
        <div className="surface-card rounded-[32px] p-5 sm:p-6">
          <SectionHeader
            eyebrow="More to love"
            title="Related picks"
            subtitle="Continue browsing inside the same refreshed card system without losing the product context."
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {relatedProducts.length
            ? relatedProducts.map((item) => <ProductCard key={item._id || item.id} product={item} />)
            : Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetails;
