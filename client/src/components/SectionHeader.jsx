const SectionHeader = ({ eyebrow, title, action }) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="mb-2 text-sm font-black uppercase text-brand-600 dark:text-brand-300">{eyebrow}</p>}
        <h2 className="max-w-3xl text-2xl font-black text-ink dark:text-white sm:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  );
};

export default SectionHeader;
