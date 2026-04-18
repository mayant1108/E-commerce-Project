import { Link } from "react-router-dom";
import { Heart, Instagram, Mail, ShieldCheck, Truck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-brand-100 bg-white/80 py-10 dark:border-white/10 dark:bg-[#15151d]">
      <div className="container-shell grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link to="/" className="mb-4 inline-flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-500 font-black text-white">M</span>
            <span className="text-xl font-black text-ink dark:text-white">Meesho Clone</span>
          </Link>
          <p className="max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
            A polished marketplace experience for budget-friendly fashion, beauty, home and daily essentials.
          </p>
          <div className="mt-5 flex gap-3">
            {[Truck, ShieldCheck, Heart, Instagram, Mail].map((Icon, index) => (
              <span
                key={index}
                className="grid h-10 w-10 place-items-center rounded-full border border-brand-100 bg-brand-50 text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-brand-300"
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-black uppercase text-ink dark:text-white">Shop</h3>
          <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-300">
            <Link to="/products?category=ethnic-wear">Ethnic Wear</Link>
            <Link to="/products?category=western-wear">Western Wear</Link>
            <Link to="/products?category=beauty">Beauty</Link>
            <Link to="/products?category=home-decor">Home Decor</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-black uppercase text-ink dark:text-white">Account</h3>
          <div className="grid gap-3 text-sm text-slate-600 dark:text-slate-300">
            <Link to="/profile">Profile</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/seller">Seller Dashboard</Link>
            <Link to="/admin">Admin Dashboard</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
