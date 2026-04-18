const DashboardStat = ({ icon: Icon, label, value, tone = "brand" }) => {
  const toneMap = {
    brand: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-200",
    teal: "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-200",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200",
    indigo: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200",
  };

  return (
    <article className="premium-card rounded-2xl p-5">
      <div className={`mb-5 grid h-12 w-12 place-items-center rounded-full ${toneMap[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{label}</p>
      <strong className="mt-2 block text-2xl font-black text-ink dark:text-white">{value}</strong>
    </article>
  );
};

export default DashboardStat;
