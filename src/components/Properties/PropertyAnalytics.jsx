import React from "react";
import { FaHome, FaEye } from "react-icons/fa";
import { motion } from "framer-motion";
import { FaHeart, FaMapMarkerAlt, FaSpinner } from "react-icons/fa";
import { BiErrorCircle } from "react-icons/bi";
import { TbDatabaseOff } from "react-icons/tb";
import { useGetMyPropertiesQuery } from "../../redux/api/propertyApi";
import { CiLocationOn } from "react-icons/ci";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  adaptiveHeight: true,
};

export default function PropertyAnalytics() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetMyPropertiesQuery();
  console.log(data?.data);
  const renderState = () => {
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-[60vh] text-gray-500 gap-3"
        >
          <TbDatabaseOff size={50} />
          <p className="text-lg font-medium">No properties found</p>
        </motion.div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto flex flex-col gap-6 w-full">
        {/* Property List */}
        <div className="grid md:grid-cols-3 gap-6">
          {data?.data.map((property) => (
            <div
              key={property.id}
              className="bg-white border rounded-xl p-4 shadow flex flex-col gap-2 cursor-pointer"
              onClick={() => navigate(`/propertydetails/${property.id}`)}
            >
              <div className="flex items-center gap-2">
                <FaHome className="text-gray-400" />
                <span className="font-medium text-black">{property.title}</span>
                <span className="ml-auto text-sm text-gray-500 flex items-center gap-2">
                  <CiLocationOn color="red" /> {property.location}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-blue-600">
                  <FaEye /> {property.total_views || "408"} Views
                </span>
                <span className="flex items-center gap-1 text-pink-700">
                  <FaHeart /> {property.wishlist_count || "120"} Saved
                </span>
              </div>

              <div className="py-4">
                <Slider {...sliderSettings}>
                  {(property.images ?? []).map((img, idx) => (
                    <img
                      key={idx}
                      src={img?.image_path || "/placeholder.jpg"}
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
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-[#7C0902]">
        My Property 
      </h3>
      {renderState()}
    </div>
  );
}
