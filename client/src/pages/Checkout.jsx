import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatCurrency";
import { readStorage, writeStorage } from "../utils/storage";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, subtotal, shipping, tax, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const saveLocalOrder = (order) => {
    const orders = readStorage("meesho_clone_orders", []);
    writeStorage("meesho_clone_orders", [order, ...orders]);
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    if (!items.length) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    const payload = {
      items: items.map((item) => ({
        product: item.product._id,
        productId: item.product._id,
        quantity: item.quantity,
      })),
      shippingAddress: form,
      paymentMethod,
    };

    try {
      const { data } = await api.post("/orders", payload);
      saveLocalOrder(data.order);
      toast.success("Order placed");
    } catch {
      const localOrder = {
        _id: `local-${Date.now()}`,
        items: items.map((item) => ({
          title: item.product.title,
          image: item.product.image || item.product.images?.[0],
          quantity: item.quantity,
          price: item.product.discountPrice || item.product.price,
        })),
        shippingAddress: form,
        paymentMethod,
        paymentStatus: paymentMethod === "COD" ? "Pending" : "Pending",
        orderStatus: "Placed",
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
        createdAt: new Date().toISOString(),
      };
      saveLocalOrder(localOrder);
      toast.success("Order placed");
    } finally {
      clearCart();
      setLoading(false);
      navigate("/orders");
    }
  };

  if (!items.length) {
    return (
      <section className="container-shell py-12">
        <EmptyState title="Nothing to checkout" message="Your selected products will appear here." />
      </section>
    );
  }

  return (
    <section className="container-shell py-10">
      <h1 className="mb-6 text-3xl font-black text-ink dark:text-white">Checkout</h1>
      <form onSubmit={placeOrder} className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="premium-card rounded-2xl p-6">
          <h2 className="text-xl font-black text-ink dark:text-white">Delivery Address</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ["fullName", "Full name"],
              ["phone", "Phone"],
              ["line1", "Address line 1"],
              ["line2", "Address line 2"],
              ["city", "City"],
              ["state", "State"],
              ["pincode", "Pincode"],
            ].map(([field, label]) => (
              <label key={field} className={field === "line1" || field === "line2" ? "grid gap-2 sm:col-span-2" : "grid gap-2"}>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{label}</span>
                <input
                  required={field !== "line2"}
                  value={form[field]}
                  onChange={(event) => updateField(field, event.target.value)}
                  className="focus-ring h-12 rounded-xl border border-brand-100 bg-white px-4 text-sm dark:border-white/10 dark:bg-[#111118] dark:text-white"
                />
              </label>
            ))}
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">Payment</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {["COD", "Razorpay"].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`rounded-2xl border px-4 py-4 text-left text-sm font-black transition ${
                    paymentMethod === method
                      ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200"
                      : "border-brand-100 bg-white text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                  }`}
                >
                  {method === "COD" ? "Cash on Delivery" : "Razorpay"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="premium-card h-fit rounded-2xl p-6">
          <h2 className="text-xl font-black text-ink dark:text-white">Order Summary</h2>
          <div className="mt-5 grid gap-4">
            {items.map((item) => (
              <div key={item.product._id} className="flex gap-3">
                <img
                  src={item.product.image || item.product.images?.[0]}
                  alt={item.product.title}
                  className="h-16 w-16 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-ink dark:text-white">{item.product.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Qty {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 border-t border-brand-100 pt-5 text-sm dark:border-white/10">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Shipping</span>
              <strong>{shipping ? formatCurrency(shipping) : "Free"}</strong>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Tax</span>
              <strong>{formatCurrency(tax)}</strong>
            </div>
            <div className="flex justify-between text-lg font-black text-ink dark:text-white">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-brand-500 text-sm font-black text-white shadow-glow transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Placing..." : "Place Order"}
          </button>
        </aside>
      </form>
    </section>
  );
};

export default Checkout;
