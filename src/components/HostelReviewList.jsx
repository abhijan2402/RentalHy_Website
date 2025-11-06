import React from "react";
import { FaHome, FaEye } from "react-icons/fa";
import { motion } from "framer-motion";
import { FaHeart, FaMapMarkerAlt, FaSpinner } from "react-icons/fa";
import { BiErrorCircle } from "react-icons/bi";
import { TbDatabaseOff } from "react-icons/tb";
import { CiLocationOn } from "react-icons/ci";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { useGetHostelReviewListQuery } from "../redux/api/feedbackApi";

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  adaptiveHeight: true,
};

export default function HostelReviewList() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetHostelReviewListQuery();
  console.log(data?.data?.data);
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

    if (data?.data?.data?.length === 0) {
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
          {data?.data?.data.map((review) => (
            <div
              key={review.id}
              className="bg-white border rounded-xl p-4 shadow flex flex-col gap-2 cursor-pointer"
              // No navigation here as this is a review, or you can navigate to detailed review if needed
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-black">
                  {review.user?.name || "Anonymous"}
                </span>
                {/* Format and display created_at date */}
                <span className="text-gray-400 text-xs">
                  {new Date(review.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="font-medium text-md">{review.title}</div>

              <div className=" text-gray-700 text-[12px]">
                {review.description}
              </div>

              {/* Optional status display */}
              <div className="text-xs text-gray-500 mt-1">
                {/* Status: {review.status || "Open"} */}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div>
      {/* <h3 className="text-xl font-bold mb-4 text-[#7C0902]"></h3> */}
      {renderState()}
    </div>
  );
}
