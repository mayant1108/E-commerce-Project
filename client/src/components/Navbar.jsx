import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Heart, Menu, Moon, Search, ShieldCheck, ShoppingBag, Sparkles, Store, Sun, Truck, User, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useWishlist } from "../context/WishlistContext";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Seller", path: "/seller" },
  { label: "Admin", path: "/admin" },
];

const topNotes = [
  { icon: Truck, label: "Free delivery on top picks" },
  { icon: ShieldCheck, label: "Secure checkout flow" },
  { icon: Sparkles, label: "Fresh daily style edits" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const submitSearch = (event) => {
    event.preventDefault();
    const search = query.trim();
    navigate(search ? `/products?search=${encodeURIComponent(search)}` : "/products");
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 px-2 pt-3 sm:px-0 sm:pt-4">
      <div className="container-shell">
        <div className="glass-panel overflow-hidden rounded-[30px]">
          <div className="hidden items-center justify-between border-b border-brand-100/80 px-5 py-3 md:flex dark:border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              {topNotes.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/75 px-3 py-1 text-xs font-bold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                >
                  <item.icon className="h-3.5 w-3.5 text-brand-500" />
                  {item.label}
                </span>
              ))}
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
              Smart shopping, styled better
            </p>
          </div>

          <div className="flex min-h-[82px] items-center gap-3 px-3 py-3 sm:px-5">
            <Link to="/" className="flex min-w-0 items-center gap-3 text-brand-600 dark:text-brand-300" aria-label="Meesho Clone">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[18px] bg-gradient-to-br from-brand-500 via-brand-400 to-amber-400 text-lg font-black text-white shadow-glow">
                M
              </span>
              <span className="min-w-0">
                <span className="block truncate text-lg font-black text-ink dark:text-white">Meesho Clone</span>
                <span className="block text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                  smart value edit
                </span>
              </span>
            </Link>

            <form onSubmit={submitSearch} className="hidden min-w-0 flex-1 lg:block">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="focus-ring h-[52px] w-full rounded-full border border-white/60 bg-white/75 pl-12 pr-4 text-sm text-ink shadow-sm placeholder:text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  placeholder="Search sarees, watches, makeup"
                />
              </label>
            </form>

            <nav className="hidden items-center gap-1 xl:flex">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#221321] text-white shadow-glow dark:bg-white dark:text-ink"
                        : "text-slate-600 hover:bg-white hover:text-brand-600 dark:text-slate-300 dark:hover:bg-white/5"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/60 bg-white/80 text-slate-700 shadow-sm transition hover:border-brand-200 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                type="button"
                title={isDark ? "Light mode" : "Dark mode"}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <Link
                to="/wishlist"
                className="relative hidden h-11 w-11 place-items-center rounded-full border border-white/60 bg-white/80 text-slate-700 shadow-sm transition hover:border-brand-200 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 sm:grid"
                title="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 px-1 text-[11px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative grid h-11 w-11 place-items-center rounded-full border border-white/60 bg-white/80 text-slate-700 shadow-sm transition hover:border-brand-200 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                title="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {count > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 px-1 text-[11px] font-bold text-white">
                    {count}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="hidden items-center gap-2 md:flex">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-3 py-2 text-sm font-semibold text-ink shadow-sm transition hover:border-brand-200 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  >
                    <User className="h-4 w-4 text-brand-500" />
                    <span className="max-w-24 truncate">{user?.name}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-full bg-[#1f1520] px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-600 dark:bg-white dark:text-ink"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden rounded-full bg-brand-500 px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-brand-600 md:inline-flex"
                >
                  Login
                </Link>
              )}

              <button
                onClick={() => setMenuOpen((open) => !open)}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/60 bg-white/80 text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200 xl:hidden"
                type="button"
                title="Menu"
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="animate-fade-up border-t border-brand-100/80 px-3 pb-4 pt-2 dark:border-white/10 xl:hidden">
              <form onSubmit={submitSearch} className="mb-3">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="focus-ring h-12 w-full rounded-full border border-white/60 bg-white/80 pl-12 pr-4 text-sm text-ink dark:border-white/10 dark:bg-white/5 dark:text-white"
                    placeholder="Search products"
                  />
                </label>
              </form>

              <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
                <div className="grid gap-2 rounded-[24px] border border-white/60 bg-white/75 p-3 shadow-soft dark:border-white/10 dark:bg-[#191922]">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-brand-50 dark:text-slate-200 dark:hover:bg-white/5"
                    >
                      {link.path === "/seller" && <Store className="h-4 w-4 text-brand-500" />}
                      {link.path === "/admin" && <ShieldCheck className="h-4 w-4 text-brand-500" />}
                      {link.path !== "/seller" && link.path !== "/admin" && <span className="h-2 w-2 rounded-full bg-brand-400" />}
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    to="/wishlist"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-brand-50 dark:text-slate-200 dark:hover:bg-white/5"
                  >
                    <Heart className="h-4 w-4 text-brand-500" />
                    Wishlist
                  </Link>
                  {isAuthenticated ? (
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-brand-50 dark:text-slate-200 dark:hover:bg-white/5"
                    >
                      <User className="h-4 w-4 text-brand-500" />
                      Profile
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-2xl bg-brand-500 px-4 py-3 text-center text-sm font-bold text-white"
                    >
                      Login
                    </Link>
                  )}
                </div>

                <div className="grid gap-2 rounded-[24px] border border-white/60 bg-white/70 p-3 shadow-soft dark:border-white/10 dark:bg-white/5">
                  {topNotes.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-brand-100 bg-brand-50/70 px-3 py-3 text-sm font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 text-brand-500" />
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
