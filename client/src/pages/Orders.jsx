import { useEffect, useState } from "react";
import api from "../api/axios";
import EmptyState from "../components/EmptyState";
import { formatCurrency } from "../utils/formatCurrency";
import { readStorage } from "../utils/storage";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await api.get("/orders/mine");
        const localOrders = readStorage("meesho_clone_orders", []);
        setOrders([...data.orders, ...localOrders.filter((order) => String(order._id).startsWith("local-"))]);
      } catch {
        setOrders(readStorage("meesho_clone_orders", []));
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (!loading && !orders.length) {
    return (
      <section className="container-shell py-12">
        <EmptyState title="No orders yet" message="Your purchases will appear here after checkout." />
      </section>
    );
  }

  return (
    <section className="container-shell py-10">
      <h1 className="mb-6 text-3xl font-black text-ink dark:text-white">Orders</h1>
      <div className="grid gap-4">
        {(loading ? Array.from({ length: 3 }) : orders).map((order, index) =>
          loading ? (
            <div key={index} className="skeleton h-32 animate-shimmer rounded-2xl" />
          ) : (
            <article key={order._id} className="premium-card rounded-2xl p-5">
              <div className="flex flex-col gap-3 border-b border-brand-100 pb-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-black text-ink dark:text-white">Order #{String(order._id).slice(-8)}</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-black text-brand-700 dark:bg-brand-500/15 dark:text-brand-200">
                    {order.orderStatus}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700 dark:bg-white/10 dark:text-slate-200">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {order.items?.map((item, itemIndex) => (
                  <div key={`${order._id}-${item.title}-${itemIndex}`} className="flex items-center gap-3">
                    <img src={item.image} alt={item.title} className="h-14 w-14 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-ink dark:text-white">{item.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Qty {item.quantity}</p>
                    </div>
                    <strong className="text-sm text-ink dark:text-white">{formatCurrency(item.price * item.quantity)}</strong>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-end border-t border-brand-100 pt-4 text-lg font-black text-ink dark:border-white/10 dark:text-white">
                {formatCurrency(order.totalPrice)}
              </div>
            </article>
          )
        )}
      </div>
    </section>
  );
};

export default Orders;
