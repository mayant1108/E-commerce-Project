import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Heart, PackageCheck, ShieldCheck, Store, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [form, setForm] = useState({
    name: user?.name || "",
    avatar: user?.avatar || "",
  });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await updateProfile(form);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container-shell py-10">
      <div className="mb-8 grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="premium-card rounded-[28px] p-6 text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-brand-50 text-4xl font-black text-brand-600 dark:bg-brand-500/15 dark:text-brand-200">
            {user?.avatar ? <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" /> : user?.name?.charAt(0)}
          </div>
          <h1 className="mt-4 text-2xl font-black text-ink dark:text-white">{user?.name}</h1>
          <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{user?.email}</p>
          <span className="mt-4 inline-flex rounded-full bg-brand-50 px-4 py-2 text-sm font-black capitalize text-brand-700 dark:bg-brand-500/15 dark:text-brand-200">
            {user?.role}
          </span>
        </aside>

        <form onSubmit={submit} className="premium-card rounded-[28px] p-6">
          <h2 className="text-xl font-black text-ink dark:text-white">Profile Details</h2>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Name</span>
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="focus-ring h-12 rounded-xl border border-brand-100 bg-white px-4 text-sm dark:border-white/10 dark:bg-[#111118] dark:text-white"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Avatar URL</span>
              <input
                value={form.avatar}
                onChange={(event) => setForm({ ...form, avatar: event.target.value })}
                className="focus-ring h-12 rounded-xl border border-brand-100 bg-white px-4 text-sm dark:border-white/10 dark:bg-[#111118] dark:text-white"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-6 rounded-full bg-brand-500 px-6 py-3 text-sm font-black text-white shadow-glow transition hover:bg-brand-600 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: PackageCheck, label: "Orders", value: "View history", path: "/orders" },
          { icon: Heart, label: "Wishlist", value: `${wishlistCount} saved`, path: "/wishlist" },
          { icon: Store, label: "Seller", value: "Dashboard", path: "/seller" },
          { icon: ShieldCheck, label: "Cart", value: `${count} items`, path: "/cart" },
        ].map((item) => (
          <Link key={item.label} to={item.path} className="premium-card rounded-2xl p-5 transition hover:-translate-y-1 hover:shadow-soft">
            <item.icon className="mb-4 h-7 w-7 text-brand-500" />
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{item.label}</p>
            <strong className="mt-1 block text-lg font-black text-ink dark:text-white">{item.value}</strong>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Profile;
