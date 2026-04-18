import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

const EmptyState = ({ title, message, actionLabel = "Browse Products", actionPath = "/products" }) => {
  return (
    <div className="premium-card mx-auto max-w-xl rounded-2xl p-8 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-brand-500 dark:bg-brand-500/15">
        <ShoppingBag className="h-7 w-7" />
      </div>
      <h2 className="mt-5 text-2xl font-black text-ink dark:text-white">{title}</h2>
      {message && <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{message}</p>}
      <Link
        to={actionPath}
        className="mt-6 inline-flex rounded-full bg-brand-500 px-6 py-3 text-sm font-black text-white shadow-glow transition hover:bg-brand-600"
      >
        {actionLabel}
      </Link>
    </div>
  );
};

export default EmptyState;
