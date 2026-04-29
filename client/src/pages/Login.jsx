import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import AuthShowcase from "../components/AuthShowcase";
import { useAuth } from "../context/AuthContext";

const loginStats = [
  { value: "7L+", label: "Monthly shoppers" },
  { value: "48h", label: "Typical dispatch promise" },
  { value: "4.7/5", label: "Loved daily picks" },
];

const loginPoints = [
  "Track orders, wishlist saves and cart activity from one profile.",
  "Move from browsing to checkout with faster repeat shopping.",
  "Secure access for shoppers, sellers and admin workflows.",
];

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const from = location.state?.from?.pathname || "/profile";

  const submit = async (event) => {
    event.preventDefault();
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section className="container-shell grid min-h-[calc(100vh-160px)] place-items-center py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[34px] border border-white/70 bg-white/[0.85] shadow-panel dark:border-white/10 dark:bg-[#191922] lg:grid-cols-[1.05fr_0.95fr]">
        <AuthShowcase
          eyebrow="Welcome back"
          title="Pick up your shopping journey without friction."
          description="Your account keeps catalogue browsing, saved products and checkout history in one polished workspace."
          image="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80"
          stats={loginStats}
          points={loginPoints}
        />

        <form onSubmit={submit} className="p-6 sm:p-10 lg:p-12">
          <span className="section-chip">Secure sign in</span>
          <h2 className="mt-5 text-3xl font-black text-ink dark:text-white sm:text-4xl">Login</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Continue shopping where you left off and keep your saved items close.
          </p>

          <div className="mt-6 rounded-[24px] border border-brand-100 bg-brand-50/70 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-2 text-sm font-black text-brand-700 dark:text-brand-200">
              <ShieldCheck className="h-4 w-4" />
              Account benefits
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Wishlist sync, faster checkout and profile-level order tracking all come back as soon as you sign in.
            </p>
          </div>

          <div className="mt-8 grid gap-4">
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
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  placeholder="Enter your password"
                  className="focus-ring h-12 w-full rounded-2xl border border-brand-100 bg-white pl-12 pr-12 text-sm dark:border-white/10 dark:bg-[#111118] dark:text-white"
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
            {loading ? "Logging in..." : "Login"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              New here?{" "}
              <Link to="/signup" className="font-black text-brand-600 dark:text-brand-300">
                Create account
              </Link>
            </p>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Redirect after login: {from === "/profile" ? "profile" : from.replace("/", "")}
            </span>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
