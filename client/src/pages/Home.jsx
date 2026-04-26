import { useEffect, useState } from "react";
import { ArrowRight, BadgePercent, Clock3, ShieldCheck, Sparkles, Star, Store, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import BannerSlider from "../components/BannerSlider";
import CategoryGrid from "../components/CategoryGrid";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import SkeletonCard from "../components/SkeletonCard";
import { categories as fallbackCategories, products as fallbackProducts } from "../data/mockData";

const servicePillars = [
  { icon: Truck, title: "Free delivery", text: "On high-value picks and repeat shopper favourites." },
  { icon: BadgePercent, title: "Daily deals", text: "Fresh markdowns across fashion, home and beauty." },
  { icon: ShieldCheck, title: "Easy returns", text: "Clear exchange flow for confidence on every order." },
  { icon: Sparkles, title: "Curated look", text: "A more premium storefront without losing the budget feel." },
];

const inspirationPanels = [
  {
    title: "Under Rs.999",
    text: "Pocket-friendly edits that still feel polished and giftable.",
    path: "/products?sort=price_asc",
  },
  {
    title: "Festive wardrobe",
    text: "Ethnic silhouettes and statement accessories for occasion days.",
    path: "/products?category=ethnic-wear",
  },
  {
    title: "Home reset",
    text: "Decor details that make shelves, corners and tables feel finished.",
    path: "/products?category=home-decor",
  },
];

const Home = () => {
  const [categories, setCategories] = useState(fallbackCategories);
  const [trendingProducts, setTrendingProducts] = useState(fallbackProducts.filter((product) => product.isTrending));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHome = async () => {
      try {
        const [categoryResponse, trendingResponse] = await Promise.all([
          api.get("/categories"),
          api.get("/products/trending?limit=8"),
        ]);
        setCategories(categoryResponse.data.categories);
        setTrendingProducts(trendingResponse.data.products);
      } catch {
        setCategories(fallbackCategories);
        setTrendingProducts(fallbackProducts.filter((product) => product.isTrending));
      } finally {
        setLoading(false);
      }
    };

    loadHome();
  }, []);

  return (
    <>
      <BannerSlider />

      <section className="container-shell py-8">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="premium-card rounded-[32px] p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-600 dark:text-brand-300">Shopping advantage</p>
                <h2 className="font-display mt-3 text-4xl leading-tight text-ink dark:text-white sm:text-5xl">
                  The storefront now feels richer and easier to scan.
                </h2>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {servicePillars.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[26px] border border-white/70 bg-white/75 p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-200">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-black text-ink dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[32px] bg-[#1d1220] text-white shadow-panel">
            <div className="border-b border-white/10 px-6 py-5 sm:px-8">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-brand-200">Why it converts better</p>
              <h3 className="mt-3 font-display text-4xl leading-tight">Sharper hierarchy. Better trust. Stronger first impression.</h3>
            </div>
            <div className="grid gap-4 px-6 py-6 sm:px-8">
              {[
                { icon: Star, label: "Top-rated product cards", detail: "Cleaner pricing, highlights and review scan." },
                { icon: Clock3, label: "Faster browse feel", detail: "Categories and homepage sections feel easier to navigate." },
                { icon: Store, label: "Seller-ready story", detail: "Homepage now supports both shopping and storefront operations." },
              ].map((item) => (
                <div key={item.label} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-brand-200">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h4 className="font-black">{item.label}</h4>
                      <p className="mt-1 text-sm leading-6 text-white/68">{item.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CategoryGrid categories={categories} />

      <section className="container-shell py-8">
        <div className="premium-card rounded-[32px] p-5 sm:p-8">
          <SectionHeader
            eyebrow="Trending now"
            title="Popular finds shoppers keep adding to cart"
            subtitle="High-interest picks with cleaner cards, stronger pricing hierarchy and more visual breathing room."
            action={
              <Link
                to="/products?sort=trending"
                className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-5 py-3 text-sm font-black text-brand-600 transition hover:bg-brand-50 dark:border-brand-500/40 dark:bg-white/5 dark:text-brand-200 dark:hover:bg-brand-500/10"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)
              : trendingProducts.slice(0, 8).map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        </div>
      </section>

      <section className="container-shell py-4">
        <div className="grid gap-4 lg:grid-cols-3">
          {inspirationPanels.map((panel, index) => (
            <Link
              key={panel.title}
              to={panel.path}
              className={`group overflow-hidden rounded-[30px] p-[1px] ${
                index === 1 ? "bg-gradient-to-br from-brand-500/50 via-amber-300/30 to-white/20" : "bg-white/60 dark:bg-white/10"
              }`}
            >
              <div className="flex h-full flex-col justify-between rounded-[29px] bg-white/88 p-6 transition group-hover:bg-white dark:bg-[#171821] dark:group-hover:bg-[#1b1d29]">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-600 dark:text-brand-300">Edit {index + 1}</p>
                  <h3 className="font-display mt-3 text-3xl leading-tight text-ink dark:text-white">{panel.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{panel.text}</p>
                </div>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-black text-brand-600 dark:text-brand-200">
                  Explore
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-shell py-12">
        <div className="relative overflow-hidden rounded-[32px] bg-ink text-white shadow-panel">
          <img
            src="https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?auto=format&fit=crop&w=1600&q=80"
            alt="Seller fashion studio"
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#160b15]/90 via-[#1f1020]/65 to-[#160b15]/40" />
          <div className="relative grid gap-8 p-8 md:grid-cols-[1.2fr_0.8fr] md:p-12">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-[0.28em] text-brand-200">Seller studio</p>
              <h2 className="font-display max-w-2xl text-4xl leading-tight sm:text-6xl">
                Manage catalogue, orders and revenue in one dashboard.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/80">
                Upload products, monitor stock and keep every order moving from packed to delivered.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em]">
                  Product uploads
                </span>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em]">
                  Order tracking
                </span>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em]">
                  Revenue snapshot
                </span>
              </div>
            </div>
            <div className="flex items-end md:justify-end">
              <Link
                to="/seller"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-brand-600 transition hover:bg-brand-50"
              >
                Open Seller Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
