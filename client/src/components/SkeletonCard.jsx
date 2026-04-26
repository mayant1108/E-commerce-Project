const SkeletonCard = () => {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/90 p-3 shadow-soft dark:border-white/10 dark:bg-[#171821]/90">
      <div className="skeleton aspect-[4/5] animate-shimmer rounded-xl" />
      <div className="mt-4 space-y-3">
        <div className="skeleton h-3 w-1/3 animate-shimmer rounded-full" />
        <div className="skeleton h-5 w-4/5 animate-shimmer rounded-full" />
        <div className="skeleton h-5 w-2/3 animate-shimmer rounded-full" />
        <div className="skeleton h-10 w-full animate-shimmer rounded-full" />
      </div>
    </div>
  );
};

export default SkeletonCard;
