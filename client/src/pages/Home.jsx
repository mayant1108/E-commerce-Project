import { useEffect, useState } from "react";
import { ArrowRight, BadgePercent, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import BannerSlider from "../components/BannerSlider";
import CategoryGrid from "../components/CategoryGrid";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import SkeletonCard from "../components/SkeletonCard";
import { categories as fallbackCategories, products as fallbackProducts } from "../data/mockData";

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

      <section className="container-shell grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Truck, title: "Free delivery", text: "On value picks across India" },
          { icon: BadgePercent, title: "Daily deals", text: "Fresh price drops every day" },
          { icon: ShieldCheck, title: "Easy returns", text: "Simple exchange workflow" },
          { icon: Sparkles, title: "Premium look", text: "Curated modern catalogue" },
        ].map((item) => (
          <article key={item.title} className="premium-card rounded-2xl p-5">
            <item.icon className="mb-4 h-7 w-7 text-brand-500" />
            <h3 className="font-black text-ink dark:text-white">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.text}</p>
          </article>
        ))}
      </section>

      <CategoryGrid categories={categories} />

      <section className="container-shell py-8">
        <SectionHeader
          eyebrow="Trending now"
          title="Popular finds shoppers keep adding to cart"
          action={
            <Link
              to="/products?sort=trending"
              className="inline-flex items-center gap-2 rounded-full border border-brand-200 px-5 py-3 text-sm font-black text-brand-600 transition hover:bg-brand-50 dark:border-brand-500/40 dark:text-brand-200 dark:hover:bg-brand-500/10"
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
      </section>

      <section className="container-shell py-12">
        <div className="relative overflow-hidden rounded-[28px] bg-ink text-white shadow-soft">
          <img
            src="https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?auto=format&fit=crop&w=1600&q=80"
            alt="Seller fashion studio"
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
          <div className="relative grid gap-8 p-8 md:grid-cols-[1.2fr_0.8fr] md:p-12">
            <div>
              <p className="mb-3 text-sm font-black uppercase text-brand-200">Seller studio</p>
              <h2 className="max-w-2xl text-3xl font-black sm:text-5xl">Manage catalogue, orders and revenue in one dashboard.</h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/80">
                Upload products, monitor stock and keep every order moving from packed to delivered.
              </p>
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
