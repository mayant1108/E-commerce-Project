import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { banners } from "../data/mockData";

const heroStats = [
  { value: "7L+", label: "Monthly shoppers" },
  { value: "48h", label: "Fast dispatch vibe" },
  { value: "4.7/5", label: "Loved product picks" },
];

const BannerSlider = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % banners.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  const banner = banners[active];

  return (
    <section className="container-shell pt-6 sm:pt-8">
      <div className="relative overflow-hidden rounded-[36px] border border-white/60 bg-[#150d16] shadow-panel dark:border-white/10">
        {banners.map((item, index) => (
          <img
            key={item.title}
            src={item.image}
            alt={item.title}
            className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${
              active === index ? "scale-100 opacity-100" : "scale-105 opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-[#120912]/88 via-[#1a0d19]/58 to-[#120912]/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,215,147,0.18),transparent_28%),radial-gradient(circle_at_left_center,rgba(255,103,177,0.2),transparent_32%)]" />

        <div className="relative z-10 grid min-h-[500px] gap-10 px-5 py-8 text-white sm:px-8 sm:py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-12">
          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-brand-200" />
                New season live
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur">
                <ShieldCheck className="h-3.5 w-3.5 text-brand-200" />
                Trusted delivery
              </span>
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.36em] text-brand-100/80">Budget-smart marketplace</p>
            <h1 className="font-display mt-4 max-w-3xl text-5xl leading-none sm:text-6xl lg:text-7xl">{banner.title}</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg">{banner.subtitle}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={banner.path}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-brand-600 shadow-lg transition hover:bg-brand-50"
              >
                {banner.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-black text-white transition hover:bg-white/15"
              >
                Browse catalogue
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {heroStats.map((item) => (
                <div key={item.label} className="rounded-[24px] border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-2xl font-black">{item.value}</p>
                  <p className="mt-1 text-sm text-white/70">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden items-stretch justify-end lg:flex">
            <div className="glass-panel flex w-full max-w-sm flex-col rounded-[30px] p-6 text-white dark:bg-white/5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/50">Slide spotlight</p>
                <h2 className="mt-4 text-2xl font-black">{banner.cta}</h2>
                <p className="mt-3 text-sm leading-6 text-white/70">{banner.subtitle}</p>
              </div>

              <div className="mt-8 space-y-3">
                {banners.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setActive(index)}
                    className={`flex w-full items-center justify-between rounded-[22px] border px-4 py-3 text-left transition ${
                      active === index
                        ? "border-white/30 bg-white/14"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold">{item.title}</p>
                      <p className="mt-1 text-xs text-white/60">{item.cta}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-white/60" />
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-[24px] border border-white/10 bg-[#fff0f7]/10 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Truck className="h-4 w-4 text-brand-200" />
                  Seller-ready operations
                </div>
                <p className="mt-2 text-sm leading-6 text-white/68">
                  Manage catalogue, stock and order flow from the seller dashboard without leaving the storefront.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 left-5 z-10 flex gap-2 sm:left-8 lg:left-12">
          {banners.map((item, index) => (
            <button
              key={item.title}
              type="button"
              title={item.title}
              onClick={() => setActive(index)}
              className={`h-2.5 rounded-full transition-all ${
                active === index ? "w-8 bg-white" : "w-2.5 bg-white/45 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BannerSlider;
