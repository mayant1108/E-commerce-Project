import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import EmptyState from "../components/EmptyState";
import { useCart } from "../context/CartContext";
import { formatCurrency, getSellingPrice } from "../utils/formatCurrency";

const Cart = () => {
  const { items, subtotal, shipping, tax, total, updateQuantity, removeFromCart } = useCart();

  if (!items.length) {
    return (
      <section className="container-shell py-12">
        <EmptyState title="Your cart is empty" message="Add a few products and they will appear here." />
      </section>
    );
  }

  return (
    <section className="container-shell py-10">
      <h1 className="mb-6 text-3xl font-black text-ink dark:text-white">Cart</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          {items.map((item) => (
            <article
              key={item.product._id}
              className="grid gap-4 rounded-2xl border border-brand-100 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#191922] sm:grid-cols-[120px_1fr_auto]"
            >
              <img
                src={item.product.image || item.product.images?.[0]}
                alt={item.product.title}
                className="aspect-square w-full rounded-xl object-cover sm:w-[120px]"
              />
              <div>
                <Link
                  to={`/products/${item.product.slug || item.product._id}`}
                  className="text-lg font-black text-ink transition hover:text-brand-600 dark:text-white"
                >
                  {item.product.title}
                </Link>
                <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Free delivery</p>
                <div className="mt-3 flex items-center gap-3">
                  <strong className="text-xl text-ink dark:text-white">{formatCurrency(getSellingPrice(item.product))}</strong>
                  {item.product.price > getSellingPrice(item.product) && (
                    <span className="text-sm text-slate-400 line-through">{formatCurrency(item.product.price)}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                <div className="flex items-center rounded-full border border-brand-100 bg-brand-50 p-1 dark:border-white/10 dark:bg-white/5">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    className="grid h-9 w-9 place-items-center rounded-full bg-white text-brand-600 shadow-sm dark:bg-[#111118]"
                    title="Decrease"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="grid h-9 min-w-10 place-items-center px-2 text-sm font-black text-ink dark:text-white">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    className="grid h-9 w-9 place-items-center rounded-full bg-white text-brand-600 shadow-sm dark:bg-[#111118]"
                    title="Increase"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.product._id)}
                  className="grid h-10 w-10 place-items-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-100 dark:bg-red-500/15 dark:text-red-200"
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="premium-card h-fit rounded-2xl p-6">
          <h2 className="text-xl font-black text-ink dark:text-white">Price Details</h2>
          <div className="mt-5 grid gap-3 text-sm">
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
            <div className="mt-3 border-t border-brand-100 pt-4 dark:border-white/10">
              <div className="flex justify-between text-lg font-black text-ink dark:text-white">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
          <Link
            to="/checkout"
            className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-brand-500 text-sm font-black text-white shadow-glow transition hover:bg-brand-600"
          >
            Checkout
          </Link>
        </aside>
      </div>
    </section>
  );
};

export default Cart;
