import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[420px]">
        <div className="absolute left-[-6%] top-6 h-64 w-64 rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-500/15" />
        <div className="absolute right-[-10%] top-28 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-500/10" />
      </div>
      <div className="relative z-10">
        <Navbar />
        <main className="pb-4">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
