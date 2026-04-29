import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Mail, Store, UserRound } from "lucide-react";
import AuthShowcase from "../components/AuthShowcase";
import { useAuth } from "../context/AuthContext";

const signupStats = [
  { value: "2 roles", label: "Shopper or seller onboarding" },
  { value: "1 tap", label: "Wishlist and cart sync" },
  { value: "24/7", label: "Storefront access" },
];

const signupPoints = [
  "Create a personal shopping profile and keep saved finds in one place.",
  "Switch to seller mode to upload products and manage orders from the dashboard.",
  "Stay inside the same polished storefront across browse, cart and checkout.",
];

const Signup = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });

  const submit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      navigate("/profile");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section className="container-shell grid min-h-[calc(100vh-160px)] place-items-center py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[34px] border border-white/70 bg-white/[0.85] shadow-panel dark:border-white/10 dark:bg-[#191922] lg:grid-cols-[1fr_0.98fr]">
        <form onSubmit={submit} className="p-6 sm:p-10 lg:p-12">
          <span className="section-chip">Create account</span>
          <h1 className="mt-5 text-3xl font-black text-ink dark:text-white sm:text-4xl">Join the marketplace</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Sign up as a shopper or seller and keep the entire storefront experience inside one account.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              {
                value: "user",
                title: "Shopper",
                text: "Save favourites, manage orders and checkout faster.",
                icon: UserRound,
              },
              {
                value: "seller",
                title: "Seller",
                text: "Upload products and monitor your catalogue from one dashboard.",
                icon: Store,
              },
            ].map((option) => {
              const active = form.role === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setForm({ ...form, role: option.value })}
                  className={`rounded-[24px] border p-4 text-left transition ${
                    active
                      ? "border-brand-500 bg-brand-50 shadow-soft dark:bg-brand-500/10"
                      : "border-white/70 bg-white/75 hover:border-brand-200 dark:border-white/10 dark:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-2xl ${
                        active
                          ? "bg-brand-500 text-white"
                          : "bg-brand-50 text-brand-600 dark:bg-white/10 dark:text-brand-200"
                      }`}
                    >
                      <option.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-black text-ink dark:text-white">{option.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{option.text}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Name</span>
              <span className="relative">
                <UserRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Your full name"
                  className="focus-ring h-12 w-full rounded-2xl border border-brand-100 bg-white pl-12 pr-4 text-sm dark:border-white/10 dark:bg-[#111118] dark:text-white"
                />
              </span>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Email</span>
              <span className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  placeholder="you@example.com"
                  className="focus-ring h-12 w-full rounded-2xl border border-brand-100 bg-white pl-12 pr-4 text-sm dark:border-white/10 dark:bg-[#111118] dark:text-white"
                />
              </span>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Password</span>
              <span className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  minLength="6"
                  required
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  placeholder="Create a strong password"
                  className="focus-ring h-12 w-full rounded-2xl border border-brand-100 bg-white px-4 pr-12 text-sm dark:border-white/10 dark:bg-[#111118] dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-slate-500 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-white/5"
                  title="Show password"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="button-primary mt-7 h-12 w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating..." : "Sign Up"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>

          <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">
            Already have an account?{" "}
            <Link to="/login" className="font-black text-brand-600 dark:text-brand-300">
              Login
            </Link>
          </p>
        </form>

        <AuthShowcase
          eyebrow="Seller + shopper ready"
          title="Create a profile that works for buying and selling."
          description="Whether you are filling a wishlist or building a storefront, the experience now feels cleaner, warmer and more trustworthy."
          image="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
          stats={signupStats}
          points={signupPoints}
        />
      </div>
    </section>
  );
};

export default Signup;
