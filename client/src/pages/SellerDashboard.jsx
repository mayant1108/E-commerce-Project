import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AlertTriangle, Boxes, IndianRupee, PackageCheck } from "lucide-react";
import api from "../api/axios";
import DashboardStat from "../components/DashboardStat";
import SectionHeader from "../components/SectionHeader";
import { categories as fallbackCategories, products as fallbackProducts, sellerDashboard } from "../data/mockData";
import { formatCurrency } from "../utils/formatCurrency";

const emptyProduct = {
  title: "",
  description: "",
  price: "",
  discountPrice: "",
  images: "",
  category: "",
  stock: "",
  rating: 4.2,
  isTrending: false,
};

const SellerDashboard = () => {
  const [summary, setSummary] = useState(sellerDashboard);
  const [categories, setCategories] = useState(fallbackCategories);
  const [products, setProducts] = useState(fallbackProducts.slice(0, 5));
  const [form, setForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [summaryResponse, categoryResponse, productResponse] = await Promise.all([
          api.get("/seller/summary"),
          api.get("/categories"),
          api.get("/seller/products"),
        ]);
        setSummary(summaryResponse.data);
        setCategories(categoryResponse.data.categories);
        setProducts(productResponse.data.products);
      } catch {
        setSummary(sellerDashboard);
        setCategories(fallbackCategories);
        setProducts(fallbackProducts.slice(0, 5));
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const createProduct = async (event) => {
    event.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      price: Number(form.price),
      discountPrice: Number(form.discountPrice || form.price),
      stock: Number(form.stock),
      images: form.images,
    };

    try {
      const { data } = await api.post("/products", payload);
      setProducts((current) => [data.product, ...current]);
      setForm(emptyProduct);
      toast.success("Product created");
    } catch (error) {
      const localProduct = {
        ...payload,
        _id: `seller-local-${Date.now()}`,
        slug: payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        images: payload.images.split(",").map((item) => item.trim()),
        category: categories.find((category) => category.slug === payload.category) || categories[0],
      };
      setProducts((current) => [localProduct, ...current]);
      setForm(emptyProduct);
      toast.success(error.message ? "Product added to dashboard" : "Product created");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="container-shell py-10">
      <SectionHeader eyebrow="Seller dashboard" title="Catalogue, orders and stock" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStat icon={Boxes} label="Products" value={loading ? "..." : summary.stats.products} />
        <DashboardStat icon={PackageCheck} label="Orders" value={loading ? "..." : summary.stats.orders} tone="teal" />
        <DashboardStat icon={IndianRupee} label="Revenue" value={loading ? "..." : formatCurrency(summary.stats.revenue)} tone="indigo" />
        <DashboardStat icon={AlertTriangle} label="Low Stock" value={loading ? "..." : summary.stats.lowStock} tone="amber" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <form onSubmit={createProduct} className="premium-card rounded-[28px] p-6">
          <h2 className="text-xl font-black text-ink dark:text-white">Add Product</h2>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Title</span>
              <input
                required
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                className="focus-ring h-12 rounded-xl border border-brand-100 bg-white px-4 text-sm dark:border-white/10 dark:bg-[#111118] dark:text-white"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Description</span>
              <textarea
                required
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                rows="4"
                className="focus-ring rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-[#111118] dark:text-white"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Price</span>
                <input
                  required
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(event) => updateField("price", event.target.value)}
                  className="focus-ring h-12 rounded-xl border border-brand-100 bg-white px-4 text-sm dark:border-white/10 dark:bg-[#111118] dark:text-white"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Discount Price</span>
                <input
                  type="number"
                  min="0"
                  value={form.discountPrice}
                  onChange={(event) => updateField("discountPrice", event.target.value)}
                  className="focus-ring h-12 rounded-xl border border-brand-100 bg-white px-4 text-sm dark:border-white/10 dark:bg-[#111118] dark:text-white"
                />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Category</span>
                <select
                  required
                  value={form.category}
                  onChange={(event) => updateField("category", event.target.value)}
                  className="focus-ring h-12 rounded-xl border border-brand-100 bg-white px-4 text-sm dark:border-white/10 dark:bg-[#111118] dark:text-white"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Stock</span>
                <input
                  required
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(event) => updateField("stock", event.target.value)}
                  className="focus-ring h-12 rounded-xl border border-brand-100 bg-white px-4 text-sm dark:border-white/10 dark:bg-[#111118] dark:text-white"
                />
              </label>
            </div>
            <label className="grid gap-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Image URLs</span>
              <input
                required
                value={form.images}
                onChange={(event) => updateField("images", event.target.value)}
                className="focus-ring h-12 rounded-xl border border-brand-100 bg-white px-4 text-sm dark:border-white/10 dark:bg-[#111118] dark:text-white"
                placeholder="https://example.com/image.jpg"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-6 rounded-full bg-brand-500 px-6 py-3 text-sm font-black text-white shadow-glow transition hover:bg-brand-600 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Create Product"}
          </button>
        </form>

        <div className="grid gap-6">
          <div className="premium-card rounded-[28px] p-6">
            <h2 className="text-xl font-black text-ink dark:text-white">Your Products</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
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

          <div className="premium-card rounded-[28px] p-6">
            <h2 className="text-xl font-black text-ink dark:text-white">Recent Orders</h2>
            <div className="mt-5 grid gap-3">
              {summary.recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between rounded-2xl bg-brand-50 p-4 dark:bg-white/5">
                  <div>
                    <p className="font-black text-ink dark:text-white">#{String(order._id).slice(-6)}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-brand-600 dark:bg-[#111118] dark:text-brand-200">
                    {order.orderStatus}
                  </span>
                  <strong className="text-sm text-ink dark:text-white">{formatCurrency(order.totalPrice)}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellerDashboard;
