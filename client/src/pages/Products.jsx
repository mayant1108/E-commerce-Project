import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
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

  const updateFilters = (nextFilters) => setFilters({ ...nextFilters, page: 1 });
  const clearFilters = () =>
    setFilters({ search: "", category: "", minPrice: "", maxPrice: "", rating: "", sort: "newest", page: 1 });

  return (
    <section className="container-shell py-8">
      <SectionHeader
        eyebrow="Marketplace"
        title={heading}
        subtitle="Browse the catalogue with the refreshed cards, filters and cleaner shopping layout."
      />

      <div className="mb-5 flex flex-col gap-3 rounded-[28px] border border-white/70 bg-white/80 p-3 shadow-soft dark:border-white/10 dark:bg-[#191922] sm:flex-row">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={filters.search}
            onChange={(event) => updateFilters({ ...filters, search: event.target.value })}
            placeholder="Search products"
            className="focus-ring h-12 w-full rounded-full border border-white/60 bg-white/90 pl-12 pr-4 text-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </label>
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
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <FilterSidebar categories={categories} filters={filters} onChange={updateFilters} onClear={clearFilters} />

        <div>
          <div className="mb-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>{pagination.total} products</span>
            <span>
              Page {pagination.page} of {pagination.pages || 1}
            </span>
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
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="mt-8 flex justify-center gap-3">
                <button
                  type="button"
                  disabled={filters.page <= 1}
                  onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}
                  className="rounded-full border border-brand-200 px-5 py-2 text-sm font-black text-brand-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-brand-500/40 dark:text-brand-200"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={filters.page >= pagination.pages}
                  onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}
                  className="rounded-full bg-brand-500 px-5 py-2 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <EmptyState title="No products found" message="Try a different search, category or price range." />
          )}
        </div>
      </div>
    </section>
  );
};

export default Products;
