import { Heart, Sparkles } from "lucide-react";
import EmptyState from "../components/EmptyState";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import { useWishlist } from "../context/WishlistContext";

const Wishlist = () => {
  const { items } = useWishlist();

  if (!items.length) {
    return (
      <section className="container-shell py-12">
        <EmptyState title="Your wishlist is empty" message="Save products you want to revisit later." />
      </section>
    );
  }

  return (
    <section className="container-shell py-10">
      <SectionHeader
        eyebrow="Saved for later"
        title="Wishlist with a cleaner product grid"
        subtitle="Keep favourite finds together and jump back into the catalogue whenever you want."
      />

      <div className="surface-card mb-6 rounded-[32px] p-5 sm:p-6">
        <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-black text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">
              <Heart className="h-4 w-4" fill="currentColor" />
              {items.length} saved picks
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              These products stay easy to revisit with the refreshed cards, pricing hierarchy and quick actions.
            </p>
          </div>
          <div className="rounded-[26px] border border-white/60 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-2 text-sm font-black text-ink dark:text-white">
              <Sparkles className="h-4 w-4 text-brand-500" />
              Wishlists should feel useful, not buried
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Browse, compare and add to cart directly from here without losing context.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default Wishlist;
