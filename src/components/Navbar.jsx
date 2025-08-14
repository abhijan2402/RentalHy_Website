import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle, FaHeart } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // get current route
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [active, setActive] = useState("Home");

  const path = !user ? "/" : "/home";
  const navItems = [
    { name: "Home", path: path },
    { name: "Properties", path: "/property" },
    { name: "About Us", path: "/about" },
    { name: "Support", path: "/support" },
  ];

  // Example wishlist count
  const wishlistCount = 3;

  // Set active based on current path
  useEffect(() => {
    const currentItem = navItems.find(
      (item) => item.path === location.pathname
    );
    if (currentItem) setActive(currentItem.name);
  }, [location.pathname]);

  const handleClick = (item) => {
    setActive(item.name);
    setIsMobileMenuOpen(false);
    navigate(item.path);
  };

  return (
    <>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 w-full z-50 bg-white shadow-md"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div
            className="text-2xl font-bold cursor-pointer text-black"
            onClick={() => navigate("/home")}
          >
            MyLogo
          </div>

          {/* Nav Items */}
          <ul className="hidden md:flex gap-6 items-center flex-1 justify-center">
            {navItems.map((item) => (
              <li
                key={item.name}
                onClick={() => handleClick(item)}
                className={`cursor-pointer font-medium px-4 py-2 rounded ${
                  active === item.name
                    ? "text-white bg-[#7C0902]"
                    : "text-black hover:text-[#7C0902]"
                }`}
              >
                {item.name}
              </li>
            ))}
          </ul>

          {/* Right Icons */}
          {/* Right Icons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate("/wishlist")}
              className="relative px-4 py-2 bg-white border border-[#7C0902] text-[#7C0902] rounded-md font-medium hover:bg-[#7C0902] hover:text-white transition duration-300"
            >
              Wishlist
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </button>

            {user && (
              <FaUserCircle
                className="text-2xl cursor-pointer text-black"
                onClick={() => navigate("/profile")}
              />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-black text-3xl"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            ☰
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 w-full h-full bg-white text-black flex flex-col items-center justify-center z-50 md:hidden"
          >
            <button
              className="absolute top-6 right-6 text-3xl text-black"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ✕
            </button>

            <ul className="flex flex-col gap-6 text-xl">
              {navItems.map((item) => (
                <li
                  key={item.name}
                  onClick={() => handleClick(item)}
                  className={`cursor-pointer font-medium ${
                    active === item.name ? "text-[#7C0902]" : "text-black"
                  }`}
                >
                  {item.name}
                </li>
              ))}
              <li className="flex gap-4 items-center">
                <div
                  className="relative cursor-pointer text-black"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/wishlist");
                  }}
                >
                  <FaHeart className="text-2xl" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <FaUserCircle
                  className="text-3xl cursor-pointer"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/profile");
                  }}
                />
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
