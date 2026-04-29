import { SlidersHorizontal, Sparkles, X } from "lucide-react";

const ratingOptions = [4.5, 4, 3.5, 3];
const pricePresets = [
  { label: "Under Rs.499", minPrice: "", maxPrice: "499" },
  { label: "Rs.500 - 999", minPrice: "500", maxPrice: "999" },
  { label: "Rs.1000+", minPrice: "1000", maxPrice: "" },
];

const FilterSidebar = ({ categories, filters, onChange, onClear }) => {
  const setFilter = (key, value) => onChange({ ...filters, [key]: value });
  const setPricePreset = ({ minPrice, maxPrice }) => onChange({ ...filters, minPrice, maxPrice });
  const activeCount = [filters.category, filters.minPrice, filters.maxPrice, filters.rating, filters.sort !== "newest"].filter(Boolean)
    .length;

  return (
    <aside className="surface-card rounded-[30px] p-5 lg:sticky lg:top-28">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-black text-ink dark:text-white">
          <SlidersHorizontal className="h-5 w-5 text-brand-500" />
          Filters
        </h2>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">
            {activeCount} active
          </span>
          <button
            type="button"
            onClick={onClear}
            className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-brand-600 hover:bg-brand-100 dark:bg-white/5 dark:text-brand-300"
            title="Clear filters"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-5 rounded-[24px] border border-brand-100 bg-brand-50/80 p-4 dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center gap-2 text-sm font-black text-brand-700 dark:text-brand-200">
          <Sparkles className="h-4 w-4" />
          Curated browsing
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Use filters to narrow the catalogue faster without losing the visual rhythm of the page.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <p className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200">Category</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilter("category", "")}
              className={`rounded-full px-3 py-2 text-sm font-bold transition ${
                !filters.category
                  ? "bg-[#1f1520] text-white shadow-glow dark:bg-white dark:text-ink"
                  : "border border-white/60 bg-white/80 text-slate-600 hover:border-brand-200 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              }`}
            >
              All
            </button>
            {categories.map((category) => {
              const value = category.slug || category.name;
              const active = filters.category === value;

              return (
                <button
                  key={category._id || value}
                  type="button"
                  onClick={() => setFilter("category", value)}
                  className={`rounded-full px-3 py-2 text-sm font-bold transition ${
                    active
                      ? "bg-brand-500 text-white shadow-glow"
                      : "border border-white/60 bg-white/80 text-slate-600 hover:border-brand-200 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

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
          <div className="mt-3 flex flex-wrap gap-2">
            {pricePresets.map((preset) => {
              const active = filters.minPrice === preset.minPrice && filters.maxPrice === preset.maxPrice;

              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setPricePreset(preset)}
                  className={`rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.16em] transition ${
                    active
                      ? "bg-brand-500 text-white shadow-glow"
                      : "border border-white/60 bg-white/80 text-slate-600 hover:border-brand-200 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
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
                    ? "border-brand-500 bg-brand-50 text-brand-700 shadow-sm dark:bg-brand-500/15 dark:text-brand-200"
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

        <button type="button" onClick={onClear} className="button-secondary w-full px-4 py-3">
          Reset all filters
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
