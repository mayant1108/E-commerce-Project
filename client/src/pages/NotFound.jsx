import EmptyState from "../components/EmptyState";

const NotFound = () => {
  return (
    <section className="container-shell py-12">
      <EmptyState title="Page not found" message="This link does not match a Meesho Clone page." actionPath="/" actionLabel="Go Home" />
    </section>
  );
};

export default NotFound;
