import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, Lock, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";

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
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-brand-100 bg-white shadow-soft dark:border-white/10 dark:bg-[#191922] lg:grid-cols-[1fr_0.95fr]">
        <div className="relative hidden min-h-[560px] lg:block">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80"
            alt="Fashion storefront"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <p className="text-sm font-black uppercase text-brand-200">Meesho Clone</p>
            <h1 className="mt-3 text-4xl font-black">Shop smarter with your account.</h1>
          </div>
        </div>

        <form onSubmit={submit} className="p-6 sm:p-10">
          <h2 className="text-3xl font-black text-ink dark:text-white">Login</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Continue shopping where you left off.</p>

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
                  className="focus-ring h-12 w-full rounded-xl border border-brand-100 bg-white pl-12 pr-4 text-sm dark:border-white/10 dark:bg-[#111118] dark:text-white"
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
                  className="focus-ring h-12 w-full rounded-xl border border-brand-100 bg-white pl-12 pr-12 text-sm dark:border-white/10 dark:bg-[#111118] dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-slate-500 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-white/5"
                  title="Show password"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-7 h-12 w-full rounded-full bg-brand-500 text-sm font-black text-white shadow-glow transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
            New here?{" "}
            <Link to="/signup" className="font-black text-brand-600 dark:text-brand-300">
              Create account
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
