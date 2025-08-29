import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle, FaHeart } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/clogo.png";
import { BiHeart } from "react-icons/bi";
import { FaLocationPin, FaLocationPinLock } from "react-icons/fa6";
import { useNavbar } from "../contexts/NavbarContext";
import { useGetWishlistStatsQuery } from "../redux/api/propertyApi";

export default function Navbar() {
  const { user } = useAuth();
  const { data, isLoading, error } = useGetWishlistStatsQuery();
  const { activeMain, setActiveMain, activeButton, setActiveButton } =
    useNavbar();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const [active, setActive] = useState("Home");

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Convention/Function Hall", path: "/convention" },
    { name: "Resort/Farm House", path: "/farm-resort" },
    { name: "Hostel", path: "/about" },
    { name: "Support", path: "/support" },
  ];

  // Example wishlist count
  const wishlistCount = 3;

  useEffect(() => {
    const currentItem = navItems.find(
      (item) => item.path === location.pathname
    );
    if (currentItem) setActiveMain(currentItem.name);
  }, [location.pathname]);

  // Optional: sync activeButton when activeMain changes so buttons highlight accordingly
  useEffect(() => {
    if (activeMain === "Home") setActiveButton("tolet");
    else if (activeMain === "Convention/Function Hall")
      setActiveButton("convention");
    else if (activeMain === "Resort/Farm House") setActiveButton("resort");
    else setActiveButton(null);
  }, [activeMain, setActiveButton]);

  const handleClickMain = (item) => {
    console.log(item);
    setActiveMain(item.name);
    setActiveButton(null);
    navigate(item.path);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
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
          <div className="cursor-pointer" onClick={() => navigate("/")}>
            <img src={logo} alt="Logo" className="h-14 w-auto" />
          </div>

          {/* Nav Items */}
          <ul className="hidden md:flex gap-2 items-center flex-1 justify-center">
            {navItems.map((item) => (
              <li
                key={item.name}
                onClick={() => handleClickMain(item)}
                className={`cursor-pointer font-medium text-sm px-4 py-2 rounded ${
                  activeMain === item.name
                    ? "text-white bg-[#7C0902]"
                    : "text-black hover:text-[#7C0902]"
                }`}
              >
                {item.name}
              </li>
            ))}
          </ul>

          {/* Right Icons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate("/wishlist")}
              className="relative p-2 rounded-full border border-[#7C0902] text-[#7C0902] hover:bg-[#7C0902] hover:text-white transition duration-300"
            >
              {/* Heart Icon */}
              <BiHeart className="w-6 h-6" />

              {/* Badge */}
              {data?.data?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {data?.data?.length}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="relative p-2 rounded-full border border-[#7C0902] text-[#7C0902] hover:bg-[#7C0902] hover:text-white transition duration-300"
            >
              <FaUserCircle className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-3 bg-white rounded-lg px-0 py-0  ">
              <div className="flex flex-col">
                <div className="flex gap-1 items-center">
                  <div className="relative p-0 rounded-full  text-[#7C0902] transition duration-300">
                    <FaLocationPin className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-[#7C0902] text-[14px]">
                    {"Jaipur"}
                  </span>
                </div>
                <p className="text-[12px] pl-1 text-gray-600">
                  {"Abc, Jaipur, Rajasthan"}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3 bg-white rounded-lg px-0 py-0  ">
            <div className="flex flex-col">
              <div className="flex gap-1 items-center">
                <div className="relative p-0 rounded-full  text-[#7C0902] transition duration-300">
                  <FaLocationPin className="w-4 h-4" />
                </div>
                <span className="font-semibold text-[#7C0902] text-[14px]">
                  {"Jaipur"}
                </span>
              </div>
              <p className="text-[12px] pl-1 text-gray-600">
                {"Abc, Jaipur, Rajasthan"}
              </p>
            </div>
          </div>
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
            className="fixed top-0 right-0 w-full h-full bg-white text-black flex flex-col items-center justify-center z-[8888] md:hidden"
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
                  onClick={() => handleClickMain(item)}
                  className={`cursor-pointer font-medium ${
                    activeMain === item.name ? "text-[#7C0902]" : "text-black"
                  }`}
                >
                  {item.name}
                </li>
              ))}
              <ul className="flex flex-col gap-4 items-start">
                <li>
                  <div
                    className="relative cursor-pointer text-black"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate("/wishlist");
                    }}
                  >
                    <span className="text-lg font-medium">Wishlist</span>
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </div>
                </li>

                <li>
                  <div
                    className="cursor-pointer text-black text-lg font-medium"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate("/profile");
                    }}
                  >
                    Profile
                  </div>
                </li>
              </ul>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
