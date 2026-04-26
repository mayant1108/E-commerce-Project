const SectionHeader = ({ eyebrow, title, subtitle, action }) => {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.28em] text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">
            <span className="h-2 w-2 rounded-full bg-brand-500" />
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-4xl leading-tight text-ink dark:text-white sm:text-[2.6rem]">{title}</h2>
        {subtitle && <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">{subtitle}</p>}
      </div>
      {action && <div className="sm:pb-1">{action}</div>}
    </div>
  );
};

export default SectionHeader;
