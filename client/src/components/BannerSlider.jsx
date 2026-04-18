import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { banners } from "../data/mockData";

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
    <section className="container-shell pt-8">
      <div className="relative min-h-[440px] overflow-hidden rounded-[28px] bg-ink shadow-soft dark:bg-black sm:min-h-[500px]">
        {banners.map((item, index) => (
          <img
            key={item.title}
            src={item.image}
            alt={item.title}
            className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${
              active === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/76 via-black/38 to-transparent" />
        <div className="relative z-10 flex min-h-[440px] max-w-2xl flex-col justify-center px-6 py-12 text-white sm:min-h-[500px] sm:px-12">
          <p className="mb-4 inline-flex w-fit rounded-full border border-white/30 bg-white/12 px-4 py-2 text-sm font-bold backdrop-blur">
            New season live
          </p>
          <h1 className="text-4xl font-black leading-tight sm:text-6xl">{banner.title}</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/85 sm:text-lg">{banner.subtitle}</p>
          <Link
            to={banner.path}
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-brand-600 shadow-lg transition hover:bg-brand-50"
          >
            {banner.cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="absolute bottom-5 left-6 z-10 flex gap-2 sm:left-12">
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
