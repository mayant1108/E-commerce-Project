import { Link } from "react-router-dom";
import SectionHeader from "./SectionHeader";

const CategoryGrid = ({ categories }) => {
  return (
    <section className="container-shell py-12">
      <SectionHeader eyebrow="Shop by category" title="Find the right shelf fast" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <Link
            key={category._id || category.slug}
            to={`/products?category=${category.slug || category.name}`}
            className="group overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft dark:border-white/10 dark:bg-[#191922]"
          >
            <div className="aspect-square overflow-hidden bg-brand-50 dark:bg-white/5">
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-3 text-center text-sm font-black text-ink dark:text-white">{category.name}</div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
