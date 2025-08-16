import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { propertyData } from "../../utils/propertydata";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaPlus } from "react-icons/fa";
import AddPropertyModal from "./AddPropertyModal";
import { useAuth } from "../../contexts/AuthContext";

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  adaptiveHeight: true,
};

export default function PropertyList() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const wishlist = !user ? "/signin" : "/wishlist";

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  // Parse all prices to numbers for sorting/comparison
  const normalizedProperties = propertyData.map((p) => ({
    ...p,
    numPrice:
      typeof p.price === "string" && p.price[0] === "$"
        ? Number(p.price.replace(/[^0-9.-]+/g, ""))
        : Number(p.price),
  }));

  const sortedProperties = [...normalizedProperties]
    .filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "low-high") return a.numPrice - b.numPrice;
      if (sort === "high-low") return b.numPrice - a.numPrice;
      if (sort === "newest")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sort === "oldest")
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      return 0;
    });

  return (
    <div className="flex-1 bg-gray-50 min-h-screen px-2">
      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-center w-full">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by title or location..."
          className="w-full sm:flex-1 border border-gray-300 rounded px-4 py-2 text-sm focus:ring-1 focus:ring-[#7C0902]  outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="relative w-full sm:w-auto">
          <select
            className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white focus:ring-1 focus:ring-[#7C0902] focus:border-[#7C0902] outline-none pr-8"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          {/* Custom dropdown icon */}
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Property List */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {sortedProperties.map((property) => (
          <div
            key={property.id}
            className="bg-white border rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow flex flex-col"
          >
            <div className="relative">
              <Slider {...sliderSettings}>
                {property.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={property.title}
                    className="w-full h-56 object-cover"
                    draggable="false"
                  />
                ))}
              </Slider>
              <span className="absolute top-2 left-2 bg-white/80 text-xs px-3 py-1 rounded shadow font-bold text-gray-700 flex items-center gap-1">
                <FaMapMarkerAlt className="text-red-500" />
                {property.location}
              </span>
            </div>
            <div className="flex-1 flex flex-col p-4">
              <h3 className="font-bold text-lg text-gray-900 truncate">
                {property.title}
              </h3>
              <ul className="flex flex-wrap gap-2 mt-1 mb-3">
                {property.features?.map((feature, idx) => (
                  <li
                    key={idx}
                    className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-medium"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mb-2">
                <span className="text-xl font-semibold text-[#7C0902]">
                  {property.price >= 100000
                    ? `$${property.price.toLocaleString()}`
                    : `₹${property.price.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between">
                <p className="text-xs text-gray-400 mb-2">
                  Posted: {property.date}
                </p>
                <p className="text-xs text-[#7C0902] mb-2">
                  {property.status === true ? " Verified" : null}
                </p>
              </div>
              <div className="flex justify-between">
                <a
                  onClick={() =>
                    !user
                      ? navigate("/signin")
                      : navigate(`/propertydetails/${property.id}`)
                  }
                  className="mt-auto text-center cursor-pointer bg-[#7C0902] text-white px-5 py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#600601] transition-colors"
                >
                  View Details
                </a>
                <a
                  onClick={() => navigate(wishlist)}
                  className="mt-auto text-center cursor-pointer border border-[#7C0902] bg-[#7c080200] text-black px-5 py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#600601a2] hover:text-white transition-colors"
                >
                  Add Wishlist
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => (!user ? navigate("/signin") : setShowModal(true))}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#7C0902] text-white px-5 py-3 rounded-full shadow-lg hover:bg-[#600601] transition-colors animate-bounce"
      >
        <FaPlus className="text-lg" />
        <span className="">Post Property</span>
      </button>

      {/* Modal */}
      {showModal && (
        <AddPropertyModal
          showModal={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
