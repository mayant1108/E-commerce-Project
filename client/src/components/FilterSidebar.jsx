import { SlidersHorizontal, X } from "lucide-react";

const ratingOptions = [4.5, 4, 3.5, 3];

const FilterSidebar = ({ categories, filters, onChange, onClear }) => {
  const setFilter = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <aside className="premium-card rounded-2xl p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-black text-ink dark:text-white">
          <SlidersHorizontal className="h-5 w-5 text-brand-500" />
          Filters
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-brand-600 hover:bg-brand-100 dark:bg-white/5 dark:text-brand-300"
          title="Clear filters"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-5">
        <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
          Category
          <select
            value={filters.category}
            onChange={(event) => setFilter("category", event.target.value)}
            className="focus-ring h-11 rounded-xl border border-brand-100 bg-white px-3 text-sm dark:border-white/10 dark:bg-[#111118]"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category._id || category.slug} value={category.slug || category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <div>
          <p className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-200">Price range</p>
          <div className="grid grid-cols-2 gap-3">
            <input
              value={filters.minPrice}
              onChange={(event) => setFilter("minPrice", event.target.value)}
              type="number"
              min="0"
              placeholder="Min"
              className="focus-ring h-11 rounded-xl border border-brand-100 bg-white px-3 text-sm dark:border-white/10 dark:bg-[#111118]"
            />
            <input
              value={filters.maxPrice}
              onChange={(event) => setFilter("maxPrice", event.target.value)}
              type="number"
              min="0"
              placeholder="Max"
              className="focus-ring h-11 rounded-xl border border-brand-100 bg-white px-3 text-sm dark:border-white/10 dark:bg-[#111118]"
            />
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-200">Rating</p>
          <div className="grid gap-2">
            {ratingOptions.map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setFilter("rating", String(rating))}
                className={`rounded-xl border px-3 py-2 text-left text-sm font-bold transition ${
                  String(filters.rating) === String(rating)
                    ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200"
                    : "border-brand-100 bg-white text-slate-600 hover:border-brand-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                }`}
              >
                {rating}+ stars
              </button>
            ))}
          </div>
        </div>

        <label className="grid gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
          Sort
          <select
            value={filters.sort}
            onChange={(event) => setFilter("sort", event.target.value)}
            className="focus-ring h-11 rounded-xl border border-brand-100 bg-white px-3 text-sm dark:border-white/10 dark:bg-[#111118]"
          >
            <option value="newest">Newest</option>
            <option value="trending">Trending</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </label>
      </div>
    </aside>
  );
};

export default FilterSidebar;
