import { Link } from "react-router-dom";
import { ArrowRight, Minus, Plus, ShieldCheck, Sparkles, Trash2, Truck } from "lucide-react";
import EmptyState from "../components/EmptyState";
import SectionHeader from "../components/SectionHeader";
import { useCart } from "../context/CartContext";
import { formatCurrency, getSellingPrice } from "../utils/formatCurrency";

const Cart = () => {
  const { items, subtotal, shipping, tax, total, updateQuantity, removeFromCart } = useCart();
  const savings = items.reduce((amount, item) => amount + Math.max((item.product.price || 0) - getSellingPrice(item.product), 0) * item.quantity, 0);

  if (!items.length) {
    return (
      <section className="container-shell py-12">
        <EmptyState title="Your cart is empty" message="Add a few products and they will appear here." />
      </section>
    );
  }

  return (
    <section className="container-shell py-10">
      <SectionHeader
        eyebrow="Your bag"
        title="Cart ready for checkout"
        subtitle="A cleaner order summary, stronger quantity controls and quicker route to checkout."
      />

      <div className="surface-dark mb-6 rounded-[32px] p-5 text-white shadow-panel sm:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-200">Items</p>
            <p className="mt-2 text-3xl font-black">{items.length}</p>
            <p className="text-sm text-white/68">products in your bag</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-200">Saved</p>
            <p className="mt-2 text-3xl font-black">{formatCurrency(savings)}</p>
            <p className="text-sm text-white/68">through ongoing discounts</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-200">Checkout vibe</p>
            <p className="mt-2 text-lg font-black">Fast, secure, cleaner</p>
            <p className="text-sm text-white/68">built for confident final review</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          {items.map((item) => {
            const productId = item.product._id || item.product.id;

            return (
              <article
                key={productId}
                className="surface-card grid gap-4 rounded-[28px] p-4 sm:grid-cols-[120px_1fr_auto]"
              >
                <img
                  src={item.product.image || item.product.images?.[0]}
                  alt={item.product.title}
                  className="aspect-square w-full rounded-xl object-cover sm:w-[120px]"
                />
                <div>
                  <Link
                    to={`/products/${item.product.slug || productId}`}
                    className="text-lg font-black text-ink transition hover:text-brand-600 dark:text-white"
                  >
                    {item.product.title}
                  </Link>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-black text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">
                      <Truck className="h-3.5 w-3.5" />
                      Free delivery
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200">
                      <Sparkles className="h-3.5 w-3.5" />
                      Popular choice
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <strong className="text-xl text-ink dark:text-white">{formatCurrency(getSellingPrice(item.product))}</strong>
                    {item.product.price > getSellingPrice(item.product) && (
                      <span className="text-sm text-slate-400 line-through">{formatCurrency(item.product.price)}</span>
                    )}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Quantity updates reflect instantly in your order summary on the right.
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <div className="flex items-center rounded-full border border-brand-100 bg-brand-50 p-1 dark:border-white/10 dark:bg-white/5">
                    <button
                      type="button"
                      onClick={() => updateQuantity(productId, item.quantity - 1)}
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
                      onClick={() => updateQuantity(productId, item.quantity + 1)}
                      className="grid h-9 w-9 place-items-center rounded-full bg-white text-brand-600 shadow-sm dark:bg-[#111118]"
                      title="Increase"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(productId)}
                    className="grid h-10 w-10 place-items-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-100 dark:bg-red-500/15 dark:text-red-200"
                    title="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="surface-card h-fit rounded-[30px] p-6 lg:sticky lg:top-28">
          <span className="section-chip">Price details</span>
          <h2 className="mt-5 text-2xl font-black text-ink dark:text-white">Ready to place the order?</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Review the total, confirm shipping and move straight into checkout.
          </p>

          <div className="mt-5 rounded-[24px] border border-brand-100 bg-brand-50/70 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-2 text-sm font-black text-brand-700 dark:text-brand-200">
              <ShieldCheck className="h-4 w-4" />
              Protected checkout
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Taxes, delivery and final payable amount are all visible before payment.
            </p>
          </div>

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
            className="button-primary mt-6 flex h-12 w-full"
          >
            Checkout
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/products" className="button-secondary mt-3 flex h-12 w-full">
            Continue shopping
          </Link>
        </aside>
      </div>
    </section>
  );
};

export default Cart;
