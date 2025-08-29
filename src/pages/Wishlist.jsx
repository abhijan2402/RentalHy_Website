import React from "react";
import Slider from "react-slick";
import { propertyData } from "../utils/propertydata";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaSadTear,
  FaSpinner,
} from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Breadcrumb from "../components/Breadcrumb";
import { useGetWishlistStatsQuery } from "../redux/api/propertyApi";
import { TbDatabaseOff } from "react-icons/tb";
import { BiErrorCircle } from "react-icons/bi";
import { convertToIST } from "../utils/utils";
import { useAuth } from "../contexts/AuthContext";

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  adaptiveHeight: true,
};

const Wishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetWishlistStatsQuery();
  console.log(data);

  const renderState = (navigate, user) => {
    if (isLoading) {
      return (
        <div className="flex flex-col  items-center justify-center h-[60vh] text-gray-600 gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <FaSpinner size={40} className="text-[#7C0902]" />
          </motion.div>
          <p className="text-lg font-medium">Loading properties...</p>
        </div>
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

    if (data?.data?.length === 0) {
      return (
        <motion.div
          className="flex flex-col items-center justify-center h-[60vh] text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FaSadTear size={50} className="mb-4 text-gray-400" />
          <h2 className="text-base sm:text-lg font-semibold">
            No Wishlist Items
          </h2>
          <p className="text-xs sm:text-sm">
            Start adding properties to your wishlist!
          </p>
        </motion.div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto flex flex-col gap-6 w-full">
        {/* Property List */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {data?.data?.map((pro) => (
            <div
              key={pro?.property.id}
              className="bg-white border rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow flex flex-col"
            >
              <div className="relative">
                <Slider {...sliderSettings}>
                  {pro?.property.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img?.image_url}
                      alt={pro?.property.title}
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
                  {pro?.property.location}
                </span>
                {/* 
                
                <button
                  className="absolute bottom-3 right-3 bg-[#7C0902] rounded-full border border-[#7C0902] p-2 shadow-md flex items-center justify-center transition hover:bg-[#FFEDF0] hover:border-[#E11D48] group"
                  
                  aria-label="Add to wishlist"
                >
                  <FaHeart
                    className="text-white text-lg hover:text-red-500 transition-transform duration-150 group-hover:scale-110"
                    
                  />
                </button>
                */}
              </div>
              <div className="flex-1 flex flex-col p-4">
                <h3 className="font-bold text-lg text-gray-900 truncate">
                  {pro?.property.title}
                </h3>
                <ul className="flex flex-wrap gap-2 mt-1 mb-3">
                  {pro?.property.features?.map((feature, idx) => (
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
                    {pro?.property.price >= 100000
                      ? `$${pro?.property.price.toLocaleString()}`
                      : `₹${pro?.property.price.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <p className="text-xs text-gray-400 mb-2">
                    <span className="text-black"></span>{" "}
                    {pro?.property.location}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-xs text-gray-400 mb-2">
                    Posted: {convertToIST(pro?.property.created_at)}
                  </p>
                  <p className="text-xs text-[#7C0902] mb-2">
                    {pro?.property.status === 1 ? " Verified" : null}
                  </p>
                </div>

                {/* Button at bottom */}
                <div className="mt-auto w-full">
                  <a
                    onClick={() =>
                      !user
                        ? navigate("/signin")
                        : navigate(`/propertydetails/${pro?.property?.id}`)
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

        {/* <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            if (page >= 1 && page <= totalPages) setCurrentPage(page);
          }}
        /> */}
      </div>
    );
  };

  return (
    <div className="mt-[120px]">
      <Breadcrumb propertyTitle={"Wishlist"} />
      <div className="flex-1 mx-2 sm:mx-6 md:mx-16 lg:mx-[80px] xl:mx-[140px] min-h-screen px-2 sm:px-4 py-8">
        {/* Header Section */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-[#7C0902] flex justify-center items-center gap-2">
            <FaHeart /> My Wishlist
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Your saved properties in one place
          </p>
        </motion.div>

        {/* No Data Handling */}
        {renderState(navigate, user)}
      </div>
    </div>
  );
};

export default Wishlist;
