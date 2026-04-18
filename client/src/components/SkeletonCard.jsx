const SkeletonCard = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-100 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#191922]">
      <div className="skeleton aspect-[4/5] animate-shimmer rounded-xl" />
      <div className="mt-4 space-y-3">
        <div className="skeleton h-4 w-4/5 animate-shimmer rounded-full" />
        <div className="skeleton h-4 w-2/3 animate-shimmer rounded-full" />
        <div className="skeleton h-10 w-full animate-shimmer rounded-full" />
      </div>
    </div>
  );
};

export default SkeletonCard;
