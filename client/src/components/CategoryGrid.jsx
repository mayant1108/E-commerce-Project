import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeader from "./SectionHeader";

const categoryNotes = [
  "Festive and everyday looks",
  "Sharp fits for casual days",
  "Comfort-first family picks",
  "Glow essentials and combos",
  "Warm accents for every room",
  "Smart gadget discoveries",
];

const CategoryGrid = ({ categories }) => {
  return (
    <section className="container-shell py-12">
      <SectionHeader
        eyebrow="Shop by category"
        title="Curated aisles that feel easier to browse"
        subtitle="Jump straight into popular shelves with stronger imagery and faster visual scanning."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category, index) => (
          <Link
            key={category._id || category.slug}
            to={`/products?category=${category.slug || category.name}`}
            className="group relative min-h-[250px] overflow-hidden rounded-[28px] shadow-soft transition duration-300 hover:-translate-y-1.5 hover:shadow-panel"
          >
            <img
              src={category.image}
              alt={category.name}
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/20 to-transparent" />
            <div className="absolute right-4 top-4 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-white backdrop-blur">
              {category.isFeatured ? "Featured" : "Popular"}
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="text-sm text-white/70">{categoryNotes[index % categoryNotes.length]}</p>
              <div className="mt-3 flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black">{category.name}</h3>
                  <p className="mt-1 text-sm text-white/75">Tap to explore matching finds</p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#1b121c] shadow-lg transition group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
