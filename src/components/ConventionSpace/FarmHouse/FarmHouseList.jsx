import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaMapMarkerAlt, FaPlus } from "react-icons/fa";

import { farmhousedata } from "../../../utils/farmhousedata";
import { useAuth } from "../../../contexts/AuthContext";
import Pagination from "../../Pagination";
import { CgHome } from "react-icons/cg";
import AddFarmHouse from "./AddFarmHouse";

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  adaptiveHeight: true,
};

export default function FarmHouseList({ setOpenFilters, openFilters }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const wishlist = !user ? "/signin" : "/wishlist";

  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");
  const [searchKeyword, setSearchKeyword] = useState(""); // triggered search
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Normalize prices for sorting
  const normalizedProperties = farmhousedata.map((p) => ({
    ...p,
    numPrice:
      typeof p.price === "string" && p.price[0] === "$"
        ? Number(p.price.replace(/[^0-9.-]+/g, ""))
        : Number(p.price),
  }));

  // Triggered filtering
  const sortedProperties = [...normalizedProperties]
    .filter(
      (p) =>
        p.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        p.location.toLowerCase().includes(searchKeyword.toLowerCase())
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

  // Handler toggles
  const isSearching = searchKeyword !== "";

  function handleButton() {
    if (!isSearching && search.trim() !== "") {
      setSearchKeyword(search);
    } else {
      // Reset
      setSearch("");
      setSearchKeyword("");
    }
  }

  // Pagination Methods
  const totalItems = sortedProperties.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate items for current page
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = currentPage * itemsPerPage;
  const farmhousedataPage = sortedProperties.slice(startIdx, endIdx);

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Property List */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
        {farmhousedataPage.map((property) => (
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
                    onClick={() =>
                      !user
                        ? navigate("/signin")
                        : navigate(`/propertydetails/${property.id}`)
                    }
                  />
                ))}
              </Slider>
              <span className="absolute top-2 left-2 bg-white/80 text-xs px-3 py-1 rounded shadow font-bold text-gray-700 flex items-center gap-1">
                <FaMapMarkerAlt className="text-red-500" />
                {property.location}
              </span>
              <button
                className="absolute bottom-3 right-3 bg-[#7C0902] rounded-full border border-[#7C0902] p-2 shadow-md flex items-center justify-center transition hover:bg-[#FFEDF0] hover:border-[#E11D48] group"
                // onClick={handleWishlistToggle} // Optional: handle add/remove action
                aria-label="Add to wishlist"
              >
                <FaHeart
                  className="text-white text-lg hover:text-red-500 transition-transform duration-150 group-hover:scale-110"
                  // You can add conditional coloring for "active" state
                />
              </button>
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
              {/* Button at bottom */}
              <div className="mt-auto w-full">
                <a
                  onClick={() =>
                    !user
                      ? navigate("/signin")
                      : navigate(`/propertydetails/${property.id}`)
                  }
                  className="w-full block text-center cursor-pointer bg-[#7C0902] text-white px-5 py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#600601] transition-colors"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          if (page >= 1 && page <= totalPages) setCurrentPage(page);
        }}
      />
      {/* Floating Add Button */}
      <button
        onClick={() => (!user ? navigate("/signin") : setShowModal(true))}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#7C0902] text-white px-5 py-3 rounded-md shadow-lg hover:bg-[#600601] transition-colors animate-bounce"
      >
        🏡
        <span className="">Upload Farm House</span>
      </button>

      {/* Modal */}
      {showModal && (
        <AddFarmHouse
          showModal={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
