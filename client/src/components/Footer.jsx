import { Link } from "react-router-dom";
import { ArrowRight, Heart, Instagram, Mail, ShieldCheck, Truck } from "lucide-react";

const shopLinks = [
  { label: "Ethnic Wear", path: "/products?category=ethnic-wear" },
  { label: "Western Wear", path: "/products?category=western-wear" },
  { label: "Beauty", path: "/products?category=beauty" },
  { label: "Home Decor", path: "/products?category=home-decor" },
];

const accountLinks = [
  { label: "Profile", path: "/profile" },
  { label: "Orders", path: "/orders" },
  { label: "Seller Dashboard", path: "/seller" },
  { label: "Admin Dashboard", path: "/admin" },
];

const trustPoints = [
  { icon: Truck, label: "Fast dispatch" },
  { icon: ShieldCheck, label: "Trusted checkout" },
  { icon: Heart, label: "Loved daily finds" },
];

const Footer = () => {
  return (
    <footer className="mt-20 pb-8 pt-6">
      <div className="container-shell">
        <div className="overflow-hidden rounded-[34px] bg-[#1b121c] text-white shadow-panel">
          <div className="grid gap-8 border-b border-white/10 px-6 py-8 md:px-8 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1fr] lg:gap-10 lg:px-10 lg:py-10">
            <div>
              <Link to="/" className="mb-4 inline-flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-[18px] bg-gradient-to-br from-brand-500 via-brand-400 to-amber-400 text-lg font-black text-white">
                  M
                </span>
                <span>
                  <span className="block text-xl font-black">Meesho Clone</span>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.28em] text-white/45">value meets polish</span>
                </span>
              </Link>
              <p className="max-w-md text-sm leading-7 text-white/72">
                A cleaner marketplace experience for fashion, beauty, home and everyday essentials with a stronger modern look.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {trustPoints.map((item) => (
                  <span
                    key={item.label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/78"
                  >
                    <item.icon className="h-3.5 w-3.5 text-brand-300" />
                    {item.label}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                {[Instagram, Mail].map((Icon, index) => (
                  <span
                    key={index}
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white/75"
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-white/55">Shop</h3>
              <div className="grid gap-3 text-sm text-white/72">
                {shopLinks.map((link) => (
                  <Link key={link.path} to={link.path} className="transition hover:text-white">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-white/55">Account</h3>
              <div className="grid gap-3 text-sm text-white/72">
                {accountLinks.map((link) => (
                  <Link key={link.path} to={link.path} className="transition hover:text-white">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-brand-200">Need a quick browse?</p>
              <h3 className="mt-3 font-display text-3xl leading-tight text-white">Open the full catalogue.</h3>
              <p className="mt-3 text-sm leading-6 text-white/68">
                Explore fresh picks, trending deals and curated categories from one place.
              </p>
              <Link
                to="/products"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[#1b121c] transition hover:bg-brand-50"
              >
                Browse products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4 px-6 py-4 text-sm text-white/52 md:flex-row md:items-center md:justify-between md:px-8 lg:px-10">
            <p>Designed for a smoother storefront experience.</p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Fashion</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Beauty</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Home</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
