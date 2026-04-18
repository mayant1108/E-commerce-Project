import { useEffect, useMemo, useState } from "react";
import { Heart, ShieldCheck, ShoppingBag, Star, Truck } from "lucide-react";
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
                className={`h-24 w-24 shrink-0 overflow-hidden rounded-2xl border bg-white p-1 ${
                  selectedImage === image ? "border-brand-500" : "border-brand-100 dark:border-white/10"
                }`}
              >
                <img src={image} alt={product.title} className="h-full w-full rounded-xl object-cover" />
              </button>
            ))}
          </div>
          <div className="order-1 overflow-hidden rounded-[28px] border border-brand-100 bg-white shadow-soft dark:border-white/10 dark:bg-[#191922] md:order-2">
            <img src={selectedImage || product.images?.[0]} alt={product.title} className="aspect-square h-full w-full object-cover" />
          </div>
        </div>

        <div className="premium-card rounded-[28px] p-6 md:p-8">
          <p className="text-sm font-black uppercase text-brand-600 dark:text-brand-300">{product.brand}</p>
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
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-brand-500 px-6 text-sm font-black text-white shadow-glow transition hover:bg-brand-600"
            >
              <ShoppingBag className="h-5 w-5" />
              Add to Cart
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className="flex h-12 items-center justify-center gap-2 rounded-full border border-brand-200 px-6 text-sm font-black text-brand-600 transition hover:bg-brand-50 dark:border-brand-500/40 dark:text-brand-200 dark:hover:bg-brand-500/10"
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
        <SectionHeader eyebrow="More to love" title="Related picks" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {relatedProducts.length
            ? relatedProducts.map((item) => <ProductCard key={item._id} product={item} />)
            : Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
      </section>
    </>
  );
};

export default ProductDetails;
