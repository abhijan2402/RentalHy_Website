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
} from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Breadcrumb from "../components/Breadcrumb";

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
  const navigate = useNavigate();

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
        {propertyData.length === 0 ? (
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
        ) : (
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {propertyData.map((property, index) => (
              <motion.div
                key={property.id}
                onClick={() => navigate(`/propertydetails/${property.id}`)}
                className="bg-white border rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow flex flex-col cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Images Slider */}
                <div className="relative">
                  <Slider {...sliderSettings}>
                    {property.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={property.title}
                        className="w-full h-40 sm:h-56 object-cover"
                        draggable="false"
                      />
                    ))}
                  </Slider>
                  <span className="absolute top-2 left-2 bg-white/80 text-xs px-3 py-1 rounded shadow font-bold text-gray-700 flex items-center gap-1">
                    <FaMapMarkerAlt className="text-red-500" />{" "}
                    {property.location}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col p-3 sm:p-4">
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate">
                    {property.title}
                  </h3>

                  {/* Features */}
                  <ul className="flex flex-wrap gap-1 sm:gap-2 mt-1 mb-2 sm:mb-3">
                    {property.features?.map((feature, idx) => (
                      <li
                        key={idx}
                        className="text-[10px] sm:text-xs bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-gray-700 font-medium"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Price */}
                  <div className="mb-1 sm:mb-2">
                    <span className="text-lg sm:text-xl font-semibold text-[#7C0902]">
                      {property.price >= 100000
                        ? `$${property.price.toLocaleString()}`
                        : `₹${property.price.toLocaleString()}`}
                    </span>
                  </div>

                  {/* Posted Info */}
                  <div className="flex justify-between">
                    <p className="text-[10px] sm:text-xs text-gray-400 mb-1 sm:mb-2">
                      Posted: {property.date}
                    </p>
                    <p className="text-[10px] sm:text-xs text-[#7C0902] mb-1 sm:mb-2">
                      {property.status === true ? "Verified" : null}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
