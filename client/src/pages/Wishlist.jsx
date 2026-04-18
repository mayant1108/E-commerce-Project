import EmptyState from "../components/EmptyState";
import ProductCard from "../components/ProductCard";
import { useWishlist } from "../context/WishlistContext";

const Wishlist = () => {
  const { items } = useWishlist();

  if (!items.length) {
    return (
      <section className="container-shell py-12">
        <EmptyState title="Your wishlist is empty" message="Save products you want to revisit later." />
      </section>
    );
  }

  return (
    <section className="container-shell py-10">
      <h1 className="mb-6 text-3xl font-black text-ink dark:text-white">Wishlist</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default Wishlist;
