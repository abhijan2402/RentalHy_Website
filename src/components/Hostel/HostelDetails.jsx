import React, { useMemo, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaHeart, FaMapMarkerAlt, FaSpinner } from "react-icons/fa";

import { motion } from "framer-motion";
import { BiErrorCircle } from "react-icons/bi";
import { TbDatabaseOff } from "react-icons/tb";
import { toast } from "react-toastify";

import {
  capitalizeFirstLetter,
  convertToIST,
  getAddressFromLatLong,
} from "../../utils/utils";
import noimg from "/noimg.jpg";
import {
  useAddToWishlistMutation,
  useRemoveToWishlistMutation,
} from "../../redux/api/propertyApi";
import PropertyMap from "../PropertyMap";
import PricesSection from "../ConventionSpace/ConventionHall/ConventionDetailing/PricesSection";
import { AmenitiesSection } from "../ConventionSpace/ConventionHall/ConventionDetailing/AmenitiesSection";
import { FeedbackForm } from "./FeedbackForm";

export default function HostelDetails({ property, error, isLoading, reviews }) {
  const [showMore, setShowMore] = useState(false);
  const [addWhishlist] = useAddToWishlistMutation();
  const [removeWhishlist] = useRemoveToWishlistMutation();
  const [location, setLocation] = useState("");
  console.log(property);
  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    adaptiveHeight: true,
  };

  console.log(property);

  const allImages = Object.values(property?.images ?? {}).flat();
  const imagesToShow =
    allImages.length > 0 ? allImages : [{ image_path: noimg }];

  const handleWishlistToggle = async (property) => {
    try {
      if (property?.is_wishlist === 1) {
        // Remove from wishlist
        await removeWhishlist(property.id)
          .unwrap()
          .then((res) => {
            toast.success(res?.message || "Wishlist updated!");
            refetch();
          })
          .catch((err) => {
            toast.error(err?.data?.message);
          });
        console.log("Removed from wishlist:", property.id);
      } else {
        // Add to wishlist
        await addWhishlist(property.id)
          .unwrap()
          .unwrap()
          .then((res) => {
            toast.success(res?.message || "Wishlist updated!");
            refetch();
          })
          .catch((err) => {
            toast.error(err?.data?.message || "Something went worng!");
          });
        console.log("Added to wishlist:", property.id);
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
    }
  };

  //   Get Address
  getAddressFromLatLong(property?.lat, property?.long).then((address) => {
    setLocation(address);
  });

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
          <p className="text-lg font-medium">Loading property details...</p>
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

    return (
      <div className="flex flex-col lg:flex-row lg:gap-4 px-4 py-8 max-w-6xl mx-auto">
        <div className="w-full max-w-[660px] border p-4 rounded-md">
          {/* Image Slider */}
          <div className="mb-6 relative">
            <Slider {...sliderSettings}>
              {property?.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img?.image_url}
                  alt={property?.title}
                  className="w-full h-[400px] object-cover rounded-lg"
                  draggable="false"
                />
              ))}
            </Slider>
            <span className="absolute top-2 left-2 right-2 bg-white/100 text-xs px-3 py-1 rounded shadow font-bold text-gray-700 flex items-center gap-1">
              <FaMapMarkerAlt className="text-red-500" />
              {location}
            </span>
            {/* Wishlist button and verification as before */}
          </div>

          {/* Title */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {capitalizeFirstLetter(property?.title)}
            </h1>
            {/* <div className="mt-auto w-40">
              <a
                onClick={() => alert("stilll to implement fucntionality")}
                className="w-full block text-center cursor-pointer bg-[#7C0902] text-white px-5 py-2 rounded-lg font-semibold text-sm shadow hover:bg-[#600601] transition-colors"
              >
                Book Now
              </a>
            </div> */}
          </div>

          {/* Hall Type */}
          <div className="mb-2">
            <span className="text-2xl font-semibold text-[#7C0902]">
              {capitalizeFirstLetter(property?.hall_type)}
            </span>
            <span className="text-gray-600 px-1 text-[12px] font-medium">
              Seating Capacity {property?.seating_capacity}
            </span>
          </div>

          {/* Address */}
          <p className="text-gray-500 text-sm mb-4">{location}</p>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-black mb-2">Description</h2>
            <p className="text-gray-700">
              {showMore
                ? property?.description
                : `${property?.description?.slice(0, 200)}...`}
            </p>
            {property?.description?.length > 200 && (
              <button
                onClick={() => setShowMore(!showMore)}
                className="mt-2 text-[#7C0902] font-sm hover:underline"
              >
                {showMore ? "Show Less" : "Show More"}
              </button>
            )}
          </div>

          {/* Pricing */}
          <PricesSection property={property} />

          {/* Amenities */}
          <AmenitiesSection property={property} />
        </div>
        <div className=" w-full lg:w-[400px] xl:w-[500px]  mt-0 lg:mt-0">
          {/* Map Section */}
          <div className="sticky top-24">
            <PropertyMap lat={property?.lat} lng={property?.long} />
            <FeedbackForm hostelId={property?.id} reviews={reviews} />
          </div>
        </div>
      </div>
    );
  };
  return <>{renderState()}</>;
}
