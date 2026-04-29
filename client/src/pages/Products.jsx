import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import EmptyState from "../components/EmptyState";
import FilterSidebar from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import SkeletonCard from "../components/SkeletonCard";
import { categories as fallbackCategories, products as fallbackProducts } from "../data/mockData";
import { getSellingPrice } from "../utils/formatCurrency";

const pageSize = 8;

const sortProducts = (items, sort) => {
  const sortedItems = [...items];

  if (sort === "price_asc") {
    return sortedItems.sort((a, b) => getSellingPrice(a) - getSellingPrice(b));
  }

  if (sort === "price_desc") {
    return sortedItems.sort((a, b) => getSellingPrice(b) - getSellingPrice(a));
  }

  if (sort === "rating") {
    return sortedItems.sort((a, b) => b.rating - a.rating);
  }

  if (sort === "trending") {
    return sortedItems.sort((a, b) => Number(b.isTrending) - Number(a.isTrending));
  }

  return sortedItems;
};

const filterFallbackProducts = (filters) => {
  const search = filters.search.toLowerCase();
  const filtered = fallbackProducts.filter((product) => {
    const matchesSearch =
      !search ||
      product.title.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search) ||
      product.brand.toLowerCase().includes(search);
    const matchesCategory =
      !filters.category ||
      product.category?.slug === filters.category ||
      product.category?.name.toLowerCase() === filters.category.toLowerCase();
    const price = getSellingPrice(product);
    const matchesMin = !filters.minPrice || price >= Number(filters.minPrice);
    const matchesMax = !filters.maxPrice || price <= Number(filters.maxPrice);
    const matchesRating = !filters.rating || product.rating >= Number(filters.rating);

    return matchesSearch && matchesCategory && matchesMin && matchesMax && matchesRating;
  });

  return sortProducts(filtered, filters.sort);
};

const Products = () => {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState(fallbackCategories);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    sort: searchParams.get("sort") || "newest",
    page: 1,
  });
  const searchKey = searchParams.toString();

  useEffect(() => {
    const currentParams = new URLSearchParams(searchKey);
    setFilters((current) => ({
      ...current,
      search: currentParams.get("search") || "",
      category: currentParams.get("category") || "",
      sort: currentParams.get("sort") || current.sort || "newest",
      page: 1,
    }));
  }, [searchKey]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) query.set(key, value);
        });
        query.set("limit", pageSize);

        const [categoryResponse, productResponse] = await Promise.all([
          api.get("/categories"),
          api.get(`/products?${query.toString()}`),
        ]);

        setCategories(categoryResponse.data.categories);
        setProducts(productResponse.data.products);
        setPagination(productResponse.data.pagination);
      } catch {
        const filteredProducts = filterFallbackProducts(filters);
        const start = (filters.page - 1) * pageSize;
        setCategories(fallbackCategories);
        setProducts(filteredProducts.slice(start, start + pageSize));
        setPagination({
          page: filters.page,
          pages: Math.max(Math.ceil(filteredProducts.length / pageSize), 1),
          total: filteredProducts.length,
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [filters]);

  const heading = useMemo(() => {
    if (filters.search) {
      return `Results for "${filters.search}"`;
    }

    if (filters.category) {
      const category = categories.find((item) => item.slug === filters.category || item.name === filters.category);
      return category?.name || "Filtered products";
    }

    return "All products";
  }, [filters.search, filters.category, categories]);

  const quickCategories = useMemo(() => categories.slice(0, 6), [categories]);
  const activeFilters = useMemo(() => {
    const category = categories.find((item) => item.slug === filters.category || item.name === filters.category);

    return [
      filters.category && { key: "category", label: category?.name || filters.category },
      filters.minPrice && { key: "minPrice", label: `Min Rs.${filters.minPrice}` },
      filters.maxPrice && { key: "maxPrice", label: `Max Rs.${filters.maxPrice}` },
      filters.rating && { key: "rating", label: `${filters.rating}+ stars` },
      filters.sort !== "newest" && { key: "sort", label: `Sort: ${filters.sort.replace("_", " ")}` },
    ].filter(Boolean);
  }, [categories, filters]);

  const updateFilters = (nextFilters) => setFilters({ ...nextFilters, page: 1 });
  const clearFilters = () =>
    setFilters({ search: "", category: "", minPrice: "", maxPrice: "", rating: "", sort: "newest", page: 1 });
  const clearSingleFilter = (key) =>
    setFilters((current) => ({
      ...current,
      [key]: key === "sort" ? "newest" : "",
      page: 1,
    }));

  return (
    <section className="container-shell py-8">
      <div className="surface-dark relative overflow-hidden rounded-[34px] p-6 text-white shadow-panel sm:p-8">
        <div className="grid-pattern absolute inset-0 opacity-20" />
        <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <span className="section-chip border-white/15 bg-white/10 text-white/80">Marketplace refresh</span>
            <h1 className="font-display mt-5 max-w-3xl text-4xl leading-tight sm:text-5xl">{heading}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
              Cleaner browsing, faster scanning and a stronger catalogue layout for every search journey.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-200">Visible now</p>
              <p className="mt-3 text-3xl font-black">{pagination.total}</p>
              <p className="mt-1 text-sm text-white/68">matching products</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-200">Browse range</p>
              <p className="mt-3 text-3xl font-black">{categories.length}</p>
              <p className="mt-1 text-sm text-white/68">active categories</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-200">Current page</p>
              <p className="mt-3 text-3xl font-black">{pagination.page}</p>
              <p className="mt-1 text-sm text-white/68">
                of {pagination.pages || 1} pages
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="surface-card mt-6 rounded-[32px] p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={filters.search}
              onChange={(event) => updateFilters({ ...filters, search: event.target.value })}
              placeholder="Search sarees, decor, beauty, gadgets"
              className="focus-ring h-12 w-full rounded-full border border-white/60 bg-white/90 pl-12 pr-4 text-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto] lg:min-w-[360px]">
            <select
              value={filters.sort}
              onChange={(event) => updateFilters({ ...filters, sort: event.target.value })}
              className="focus-ring h-12 rounded-full border border-white/60 bg-white px-4 text-sm font-bold dark:border-white/10 dark:bg-[#111118] dark:text-white"
            >
              <option value="newest">Newest</option>
              <option value="trending">Trending</option>
              <option value="price_asc">Price low to high</option>
              <option value="price_desc">Price high to low</option>
              <option value="rating">Top rated</option>
            </select>
            <div className="flex items-center justify-center gap-2 rounded-full border border-brand-100 bg-brand-50/70 px-4 text-sm font-black text-brand-700 dark:border-white/10 dark:bg-white/5 dark:text-brand-200">
              <Sparkles className="h-4 w-4" />
              Better browsing
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => updateFilters({ ...filters, category: "" })}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              !filters.category
                ? "bg-[#1f1520] text-white shadow-glow dark:bg-white dark:text-ink"
                : "border border-white/60 bg-white/80 text-slate-600 hover:border-brand-200 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
            }`}
          >
            All
          </button>
          {quickCategories.map((category) => {
            const value = category.slug || category.name;
            const isActive = filters.category === value;

            return (
              <button
                key={category._id || value}
                type="button"
                onClick={() => updateFilters({ ...filters, category: value })}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  isActive
                    ? "bg-brand-500 text-white shadow-glow"
                    : "border border-white/60 bg-white/80 text-slate-600 hover:border-brand-200 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>

        {activeFilters.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-black text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">
              <SlidersHorizontal className="h-4 w-4" />
              {activeFilters.length} active filters
            </div>
            {activeFilters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() => clearSingleFilter(filter.key)}
                className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-200 hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              >
                {filter.label}
                <X className="h-3.5 w-3.5" />
              </button>
            ))}
            <button type="button" onClick={clearFilters} className="button-secondary px-4 py-2">
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr]">
        <FilterSidebar categories={categories} filters={filters} onChange={updateFilters} onClear={clearFilters} />

        <div>
          <div className="surface-card mb-5 rounded-[28px] p-4 sm:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <SectionHeader
                  eyebrow="Live catalogue"
                  title="Fresh products, cleaner results"
                  subtitle="Every card now prioritises pricing, reviews and fast-add actions without making the page feel crowded."
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[24px] border border-brand-100 bg-brand-50/70 px-4 py-4 dark:border-white/10 dark:bg-white/5">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-600 dark:text-brand-200">Showing</p>
                  <p className="mt-2 text-2xl font-black text-ink dark:text-white">{products.length}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">products on this page</p>
                </div>
                <div className="rounded-[24px] border border-white/60 bg-white/80 px-4 py-4 dark:border-white/10 dark:bg-white/5">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Browse status</p>
                  <p className="mt-2 text-lg font-black text-ink dark:text-white">
                    Page {pagination.page} of {pagination.pages || 1}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">refined with filters and search</p>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : products.length ? (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
              <div className="mt-8 flex justify-center gap-3">
                <button
                  type="button"
                  disabled={filters.page <= 1}
                  onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}
                  className="button-secondary px-5 py-2.5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={filters.page >= pagination.pages}
                  onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}
                  className="button-primary px-5 py-2.5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <EmptyState
              title="No products found"
              message="Try a different search, category or price range."
              actionLabel="Reset and browse"
              actionPath="/products"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Products;
