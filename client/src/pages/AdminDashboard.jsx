import { useEffect, useState } from "react";
import { Boxes, IndianRupee, PackageCheck, UsersRound } from "lucide-react";
import api from "../api/axios";
import DashboardStat from "../components/DashboardStat";
import SectionHeader from "../components/SectionHeader";
import { adminDashboard, products as fallbackProducts } from "../data/mockData";
import { formatCurrency } from "../utils/formatCurrency";

const AdminDashboard = () => {
  const [summary, setSummary] = useState(adminDashboard);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState(fallbackProducts.slice(0, 6));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [summaryResponse, userResponse, productResponse] = await Promise.all([
          api.get("/admin/summary"),
          api.get("/admin/users?limit=6"),
          api.get("/products?limit=6"),
        ]);
        setSummary(summaryResponse.data);
        setUsers(userResponse.data.users);
        setProducts(productResponse.data.products);
      } catch {
        setSummary(adminDashboard);
        setUsers([
          { _id: "user-admin", name: "Admin User", email: "admin@meesho.test", role: "admin" },
          { _id: "user-seller", name: "Seller User", email: "seller@meesho.test", role: "seller" },
          { _id: "user-demo", name: "Demo User", email: "user@meesho.test", role: "user" },
        ]);
        setProducts(fallbackProducts.slice(0, 6));
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <section className="container-shell py-10">
      <SectionHeader eyebrow="Admin dashboard" title="Marketplace control room" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStat icon={UsersRound} label="Users" value={loading ? "..." : summary.stats.users} />
        <DashboardStat icon={Boxes} label="Products" value={loading ? "..." : summary.stats.products} tone="teal" />
        <DashboardStat icon={PackageCheck} label="Orders" value={loading ? "..." : summary.stats.orders} tone="amber" />
        <DashboardStat icon={IndianRupee} label="Revenue" value={loading ? "..." : formatCurrency(summary.stats.revenue)} tone="indigo" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <div className="grid gap-6">
          <div className="premium-card rounded-[28px] p-6">
            <h2 className="text-xl font-black text-ink dark:text-white">Recent Orders</h2>
            <div className="mt-5 grid gap-3">
              {summary.recentOrders.map((order) => (
                <div key={order._id} className="grid gap-3 rounded-2xl bg-brand-50 p-4 dark:bg-white/5 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                  <div>
                    <p className="font-black text-ink dark:text-white">#{String(order._id).slice(-8)}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-black text-brand-600 dark:bg-[#111118] dark:text-brand-200">
                    {order.orderStatus}
                  </span>
                  <strong className="text-sm text-ink dark:text-white">{formatCurrency(order.totalPrice)}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-card rounded-[28px] p-6">
            <h2 className="text-xl font-black text-ink dark:text-white">Product Catalogue</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Stock</th>
                    <th className="pb-3">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-100 dark:divide-white/10">
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img src={product.images?.[0]} alt={product.title} className="h-12 w-12 rounded-xl object-cover" />
                          <span className="font-black text-ink dark:text-white">{product.title}</span>
                        </div>
                      </td>
                      <td className="py-4 text-slate-600 dark:text-slate-300">{product.category?.name || "Category"}</td>
                      <td className="py-4 font-bold text-ink dark:text-white">{formatCurrency(product.discountPrice || product.price)}</td>
                      <td className="py-4 text-slate-600 dark:text-slate-300">{product.stock}</td>
                      <td className="py-4 text-slate-600 dark:text-slate-300">{product.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="premium-card rounded-[28px] p-6">
            <h2 className="text-xl font-black text-ink dark:text-white">User Roles</h2>
            <div className="mt-5 grid gap-3">
              {summary.stats.roles.map((role) => (
                <div key={role._id} className="rounded-2xl bg-white p-4 shadow-sm dark:bg-white/5">
                  <div className="flex items-center justify-between">
                    <span className="font-black capitalize text-ink dark:text-white">{role._id}</span>
                    <strong className="text-brand-600 dark:text-brand-200">{role.count}</strong>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-brand-50 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{ width: `${Math.min((role.count / Math.max(summary.stats.users, 1)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-card rounded-[28px] p-6">
            <h2 className="text-xl font-black text-ink dark:text-white">Users</h2>
            <div className="mt-5 grid gap-3">
              {users.map((user) => (
                <div key={user._id} className="flex items-center justify-between rounded-2xl bg-brand-50 p-4 dark:bg-white/5">
                  <div className="min-w-0">
                    <p className="truncate font-black text-ink dark:text-white">{user.name}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black capitalize text-brand-600 dark:bg-[#111118] dark:text-brand-200">
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
