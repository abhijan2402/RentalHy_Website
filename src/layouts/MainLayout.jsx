// src/layouts/MainLayout.jsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollTracker from "../components/ScrollTracker/ScrollTracker";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="bg-white text-gray-900 dark:bg-background dark:text-white font-sans">
      <Navbar />
      <Outlet />
      <Footer />
      <ScrollTracker />
    </div>
  );
}
