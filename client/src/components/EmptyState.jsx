import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";

const EmptyState = ({ title, message, actionLabel = "Browse Products", actionPath = "/products" }) => {
  return (
    <div className="surface-card relative mx-auto max-w-xl overflow-hidden rounded-[30px] p-8 text-center">
      <div className="absolute inset-x-10 top-0 h-24 rounded-full bg-brand-200/30 blur-3xl dark:bg-brand-500/10" />
      <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-brand-500 dark:bg-brand-500/15">
        <ShoppingBag className="h-7 w-7" />
      </div>
      <h2 className="relative mt-5 text-2xl font-black text-ink dark:text-white">{title}</h2>
      {message && <p className="relative mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{message}</p>}
      <Link
        to={actionPath}
        className="button-primary relative mt-6 px-6 py-3"
      >
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
};

export default EmptyState;
