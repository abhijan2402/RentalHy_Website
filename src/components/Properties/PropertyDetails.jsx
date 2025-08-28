import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaHeart, FaMapMarkerAlt, FaSpinner } from "react-icons/fa";
import { convertToIST } from "../../utils/utils";
import { motion } from "framer-motion";
import { BiErrorCircle } from "react-icons/bi";
import { TbDatabaseOff } from "react-icons/tb";

export default function PropertyDetails({ property, error, isLoading }) {
  const [showMore, setShowMore] = useState(false);
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

  const basicDetails = [
    property?.area_sqft && `Area ${property?.area_sqft} Sq.ft`,
    property?.facing_direction && `${property?.facing_direction} Facing`,
    property?.advance && `${property?.advance} Advance`,
    property?.bathrooms && `${property?.bathrooms} Bathrooms`,
    property?.bedrooms && `${property?.bedrooms} Bedrooms`,
    property?.parking_available &&
      `Parking Available for ${
        property.parking_available === "Both"
          ? "Car and Bike"
          : property.parking_available
      } `,
  ].filter(Boolean);

  // Amenities
  let amenitiesObj = {};
  try {
    if (property?.amenities) {
      amenitiesObj = JSON.parse(property.amenities);
    }
  } catch (e) {
    amenitiesObj = {};
    console.error("Failed to parse amenities", e);
  }

  // Perferred Tent Type
  let preferredTenantArray = [];
  try {
    preferredTenantArray = property?.preferred_tenant_type
      ? JSON.parse(property.preferred_tenant_type)
      : [];
  } catch (e) {
    console.error("Failed to parse preferred_tenant_type", e);
    preferredTenantArray = [];
  }
  // BHK and Furnishing status
  let bhkArray = [];
  let furnishingArray = [];

  try {
    bhkArray = property?.bhk ? JSON.parse(property.bhk) : [];
  } catch {
    bhkArray = [];
  }

  try {
    furnishingArray = property?.furnishing_status
      ? JSON.parse(property.furnishing_status)
      : [];
  } catch {
    furnishingArray = [];
  }

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

    if (property.length === 0) {
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {property?.title}
          </h1>
        </div>
        <p className="text-gray-500 mb-4">{property?.location}</p>

        {/* Price */}
        <div className="mb-6">
          <span className="text-2xl font-semibold text-[#7C0902]">
            ₹{property?.price.toLocaleString()}
          </span>
        </div>

        {/* Image Slider */}
        <div className="mb-6 relative">
          <Slider {...sliderSettings}>
            {property?.images.map((img, idx) => (
              <img
                key={idx}
                src={img?.image_url}
                alt={property?.title}
                className="w-full h-[400px] object-cover rounded-lg"
                draggable="false"
              />
            ))}
          </Slider>
          <span className="absolute top-2 left-2 bg-white/80 text-xs px-3 py-1 rounded shadow font-bold text-gray-700 flex items-center gap-1">
            <FaMapMarkerAlt className="text-red-500" />
            {property?.location}
          </span>
          <button
            className={`absolute bottom-3 right-3 rounded-full border p-2 shadow-md flex items-center justify-center transition
        ${
          property?.is_wishlist
            ? "bg-[#7C0902] border-[#7C0902]"
            : "bg-white border-gray-300"
        }
        hover:bg-[#FFEDF0] hover:border-[#E11D48] group`}
            aria-label={
              property?.is_wishlist ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            <FaHeart
              className={`text-lg transition-transform duration-150 group-hover:scale-110 ${
                property?.is_wishlist
                  ? "text-red-500"
                  : "text-gray-400 hover:text-red-500"
              }`}
            />
          </button>
          {property?.status === 1 ? (
            <span className="absolute top-2 right-4 bg-white/80 text-xs px-3 py-1 rounded shadow font-bold text-[#7C0902]">
              {property?.status === 1 ? " Verified" : null}
            </span>
          ) : null}
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2">Description</h2>
          <p className="text-gray-700">
            {showMore
              ? property?.description
              : `${property?.description?.slice(0, 200)}...`}
          </p>
          {property?.description?.length > 200 && (
            <button
              onClick={() => setShowMore(!showMore)}
              className="mt-2 text-[#7C0902] font-medium hover:underline"
            >
              {showMore ? "Show Less" : "Show More"}
            </button>
          )}
        </div>

        {/* Bhk and Furnishing Status */}
        <div className="mb-6">
          <h2 className="text-lg text-black font-medium mb-2">
            Property Details
          </h2>

          <div
            className="felx flex-row
           gap-5 sm:flex"
          >
            {/* BHK */}
            <div>
              <h3 className="font-semibold mb-1">BHK</h3>
              <ul className="flex flex-wrap gap-2 mb-3">
                {bhkArray.map((bhk, idx) => (
                  <li
                    key={idx}
                    className="bg-blue-100 px-3 py-1 rounded-full text-blue-700 text-sm font-medium"
                  >
                    {bhk}
                  </li>
                ))}
              </ul>
            </div>

            {/* Furnishing Status */}
            <div>
              <h3 className="font-semibold mb-1">Furnishing Status</h3>
              <ul className="flex flex-wrap gap-2">
                {furnishingArray.map((furnish, idx) => (
                  <li
                    key={idx}
                    className="bg-green-100 px-3 py-1 rounded-full text-green-700 text-sm font-medium"
                  >
                    {furnish}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Prefred Tenat Type */}
        <div className="mb-6">
          <h2 className="text-lg text-black font-medium mb-2">
            Preferred Tenant Types
          </h2>
          <ul className="flex flex-wrap gap-2">
            {preferredTenantArray.map((tenant, idx) => (
              <li
                key={idx}
                className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 text-sm "
              >
                {tenant}
              </li>
            ))}
          </ul>
        </div>

        {/* Features */}
        <div className="mb-6">
          <h2 className="text-lg text-black font-medium mb-2">Features</h2>
          <ul className="flex flex-wrap gap-2">
            {basicDetails.map((item, idx) => (
              <li
                key={idx}
                className="bg-gray-50 border px-3 py-1 rounded-lg text-gray-700 text-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Amenities */}
        <div className="mb-6">
          <h2 className="text-lg text-black font-medium mb-2">Amenities</h2>
          <ul className="flex flex-wrap gap-2">
            {Object.entries(amenitiesObj).map(([key, value], idx) => (
              <li
                key={idx}
                className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 text-sm "
              >
                {key}
              </li>
            ))}
          </ul>
        </div>

        {/* Posted Date */}
        <p className="text-sm text-gray-400 mb-6">
          Posted on: {convertToIST(property?.created_at)}
        </p>

        {/* Contact Section */}
        <div className="p-6 border rounded-lg shadow-sm mb-8 bg-white">
          <h2 className="text-lg font-bold mb-4 border-b pb-2 text-gray-800">
            Contact Landlord
          </h2>

          <div className="space-y-3">
            {/* Name */}
            <div className="flex items-center">
              <span className="w-6 text-gray-500">
                <i className="fas fa-user"></i>
              </span>
              <span className="font-medium text-gray-700">Name:</span>
              <span className="ml-2 text-gray-900">
                {property?.user?.name || "John Doe"}
              </span>
            </div>

            {/* Phone */}
            <div className="flex items-center">
              <span className="w-6 text-gray-500">
                <i className="fas fa-phone-alt"></i>
              </span>
              <span className="font-medium text-gray-700">Phone:</span>
              <span className="ml-2 text-gray-900">
                {property?.user?.phone_number || "+91-9876543210"}
              </span>
            </div>

            {/* Email */}
            <div className="flex items-center">
              <span className="w-6 text-gray-500">
                <i className="fas fa-envelope"></i>
              </span>
              <span className="font-medium text-gray-700">Email:</span>
              <span className="ml-2 text-gray-900">
                {property?.user?.email || "landlord@example.com"}
              </span>
            </div>
          </div>

          {/* Button */}
          <div className="mt-5">
            <button
              onClick={() =>
                alert("Contact form or call can be implemented here")
              }
              className="w-full bg-[#7C0902] text-white px-5 py-2.5 rounded-lg font-semibold shadow hover:bg-[#600601] transition-colors"
            >
              Contact Landlord
            </button>
          </div>
        </div>

        {/* Map */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2">Location Map</h2>
          <iframe
            title="property-location"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              property.location
            )}&output=embed`}
            width="100%"
            height="300"
            allowFullScreen=""
            loading="lazy"
            className="rounded-lg border"
          ></iframe>
        </div>
      </div>
    );
  };
  return <>{renderState()}</>;
}
