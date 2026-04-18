import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Mail, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
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
      <form onSubmit={submit} className="premium-card w-full max-w-xl rounded-[28px] p-6 sm:p-10">
        <h1 className="text-3xl font-black text-ink dark:text-white">Create Account</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Join Meesho Clone as a shopper or seller.</p>

        <div className="mt-8 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Name</span>
            <span className="relative">
              <UserRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="focus-ring h-12 w-full rounded-xl border border-brand-100 bg-white pl-12 pr-4 text-sm dark:border-white/10 dark:bg-[#111118] dark:text-white"
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
                className="focus-ring h-12 w-full rounded-xl border border-brand-100 bg-white pl-12 pr-4 text-sm dark:border-white/10 dark:bg-[#111118] dark:text-white"
              />
            </span>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Password</span>
            <input
              type="password"
              minLength="6"
              required
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className="focus-ring h-12 w-full rounded-xl border border-brand-100 bg-white px-4 text-sm dark:border-white/10 dark:bg-[#111118] dark:text-white"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Account type</span>
            <select
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value })}
              className="focus-ring h-12 rounded-xl border border-brand-100 bg-white px-4 text-sm dark:border-white/10 dark:bg-[#111118] dark:text-white"
            >
              <option value="user">User</option>
              <option value="seller">Seller</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-7 h-12 w-full rounded-full bg-brand-500 text-sm font-black text-white shadow-glow transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{" "}
          <Link to="/login" className="font-black text-brand-600 dark:text-brand-300">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Signup;
