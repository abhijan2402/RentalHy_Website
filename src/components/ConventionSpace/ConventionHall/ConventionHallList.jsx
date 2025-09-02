import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaMapMarkerAlt, FaPlus, FaSpinner } from "react-icons/fa";
import { BiBuilding, BiErrorCircle, BiHomeAlt2 } from "react-icons/bi";
import { HiHome } from "react-icons/hi2";
import { MdFilterList } from "react-icons/md";
import { conventionhalldata } from "../../../utils/conventionhall";
import AddConventionHall from "./AddConventionHall";
import { useAuth } from "../../../contexts/AuthContext";
import Pagination from "../../Pagination";
import { CgHome } from "react-icons/cg";
import { capitalizeFirstLetter, convertToIST } from "../../../utils/utils";
import noimg from "/noimg.jpg";
import { TbDatabaseOff } from "react-icons/tb";
import { motion } from "framer-motion";
import CardLoader from "../../CardLoader";

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  adaptiveHeight: true,
};

export default function ConventionHallList({
  setOpenFilters,
  openFilters,
  handleSearchInputChange,
  handleSearchButton,
  handleSortChange,
  search,
  searchKeyword,
  sort,
  data,
  setPageNo,
  isLoading,
  error,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();


  const [showModal, setShowModal] = useState(false);

  const conventionList = data?.data?.data ?? [];

  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = data?.data?.total ?? 0;
  const perPage = data?.data?.per_page ?? 20;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  useEffect(() => {
    if (data?.data?.current_page) {
      setCurrentPage(data?.data?.current_page);
    }
  }, [data]);

  console.log(conventionList);
  const renderState = () => {
    if (isLoading) {
      return (
        <>
          <div className="mt-5">
            <CardLoader count={9} />;
          </div>
        </>
      );
    }

    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center h-[60vh] text-red-600 gap-3"
        >
          <BiErrorCircle size={50} />
          <p className="text-lg font-semibold">Something went wrong</p>
          <p className="text-sm text-gray-500">Please try again later</p>
        </motion.div>
      );
    }

    if (conventionList?.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-[60vh] text-gray-500 gap-3"
        >
          <TbDatabaseOff size={50} />
          <p className="text-lg font-medium">
            No Convention/Fucniton Hall found
          </p>
        </motion.div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto flex flex-col gap-6 w-full">
        {/* Property List */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {conventionList.map((property) => {
            const allImages = Object.values(
              property.images_grouped ?? {}
            ).flat();
            const imagesToShow =
              allImages.length > 0 ? allImages : [{ image_path: noimg }];

            return (
              <div
                key={property.id}
                className="border rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow flex flex-col"
              >
                <div className="relative">
                  <Slider {...sliderSettings}>
                    {imagesToShow.map((img, idx) => (
                      <img
                        key={idx}
                        src={img?.image_path}
                        alt={property.title}
                        className="w-full h-56 object-cover"
                        draggable="false"
                        onClick={() =>
                          !user
                            ? navigate("/signin")
                            : navigate(`/conventiondetails/${property.id}`)
                        }
                      />
                    ))}
                  </Slider>

                  {/* <span className="absolute top-2 left-2 bg-white/80 text-xs px-3 py-1 rounded shadow font-bold text-gray-700 flex items-center gap-1">
                  <FaMapMarkerAlt className="text-red-500" />

                  {property.location}
                </span> */}
                </div>

                <div className="flex-1 flex flex-col p-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 truncate">
                      {capitalizeFirstLetter(property.title)}
                    </h3>
                  </div>

                  <p className="font-medium text-sm px-2 py-1 text-gray-600 truncate">
                    {property.description}
                  </p>

                  <div className="flex justify-between">
                    <p className="text-xs text-gray-500 mb-2">
                      <span className="text-black"></span>{" "}
                      {capitalizeFirstLetter(property.type)}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      <span className="text-black"></span> Capacity:{" "}
                      {property.seating_capacity}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-xs text-gray-400 mb-2">
                      Posted: {convertToIST(property.created_at)}
                    </p>
                  </div>

                  {/* Button at bottom */}

                  <div className="mt-auto w-full">
                    <a
                      onClick={() =>
                        !user
                          ? navigate("/signin")
                          : alert("stilll to implement fucntionality")
                      }
                      className="w-full block text-center cursor-pointer bg-[#7C0902] text-white px-5 py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#600601] transition-colors"
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col md:flex-row mt-4 justify-between items-center gap-4">
          {/* Items per page selector */}
          <div className="flex items-center space-x-2">
            <label htmlFor="per-page" className="text-[#7C0902] text-sm">
              Items per page: {data?.data?.per_page}
            </label>
            {/* <select
              id="per-page"
              value={data?.data?.per_page}
              // onChange={(e) => handleItemsPerPage(e.target.value)}
              className="border border-gray-300 text-[#7C0902] rounded px-2 py-1 text-sm"
            >
              {[2, 5, 10, 20, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select> */}
          </div>

          {/* Pagination Buttons */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setPageNo(page)}
          />
        </div>
      </div>
    );
  };
  return (
    <div className="flex-1 bg-gray-50 min-h-screen px-0">
      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-2 items-center w-full">
        {/* Search with dynamic button inside */}
        <div className="relative w-full sm:flex-1">
          <input
            type="text"
            placeholder="Search by title or location..."
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm pr-20 focus:ring-1 focus:ring-[#7C0902] outline-none"
            value={search}
            onChange={handleSearchInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSearchButton()}
          />
          <button
            onClick={handleSearchButton}
            className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded 
                  ${searchKeyword ? "bg-gray-400" : "bg-[#7C0902]"}
                  text-white text-sm font-medium`}
          >
            {searchKeyword ? "Reset" : "Search"}
          </button>
        </div>
        {/* Sorting */}
        <div className="relative w-full sm:w-auto">
          <select
            className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white focus:ring-1 focus:ring-[#7C0902] focus:border-[#7C0902] outline-none pr-8"
            value={sort}
            onChange={handleSortChange}
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
        {/* Right side button */}
        <div className="w-full md:w-auto">
          <button
            onClick={() => setOpenFilters(true)}
            className="flex items-center justify-center gap-2 w-full md:w-auto"
            style={{
              backgroundColor: "#7C0902",
              color: "white",
              padding: "8px 12px",
              borderRadius: "6px",
            }}
          >
            <MdFilterList size={18} /> Filters
          </button>
        </div>
      </div>
      {/* Convention List */}
      {renderState()}

      {/* Floating Add Button */}
      <button
        onClick={() => (!user ? navigate("/signin") : setShowModal(true))}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#7C0902] text-white px-5 py-3 rounded-md shadow-lg hover:bg-[#600601] transition-colors animate-bounce"
      >
        <BiBuilding className="text-lg" />
        <span className="">Upload Convention/Fucntion Hall</span>
      </button>

      {/* Modal */}
      {showModal && (
        <AddConventionHall
          showModal={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
