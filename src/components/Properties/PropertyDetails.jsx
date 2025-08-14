import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function PropertyDetails({ property }) {
  const [showMore, setShowMore] = useState(false);

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

  // Example Amenities (can be from property.amenities)
  const amenities = property.amenities || [
    "Swimming Pool",
    "Gym",
    "Parking Space",
    "24/7 Security",
    "Lift",
    "Power Backup",
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {property.title}
        </h1>
      </div>
      <p className="text-gray-500 mb-4">{property.location}</p>

      {/* Price */}
      <div className="mb-6">
        <span className="text-2xl font-semibold text-[#7C0902]">
          {property.price >= 100000
            ? `$${property.price.toLocaleString()}`
            : `₹${property.price.toLocaleString()}`}
        </span>
      </div>

      {/* Image Slider */}
      <div className="mb-6 relative">
        <Slider {...sliderSettings}>
          {property.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={property.title}
              className="w-full h-[400px] object-cover rounded-lg"
              draggable="false"
            />
          ))}
        </Slider>
        <span className="absolute top-2 right-4 bg-white/80 text-xs px-3 py-1 rounded shadow font-bold text-[#7C0902]">
          {property.status === true ? " Verified" : null}
        </span>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">Description</h2>
        <p className="text-gray-700">
          {showMore
            ? property.description
            : `${property.description?.slice(0, 200)}...`}
        </p>
        {property.description?.length > 200 && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="mt-2 text-[#7C0902] font-medium hover:underline"
          >
            {showMore ? "Show Less" : "Show More"}
          </button>
        )}
      </div>

      {/* Features */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">Features</h2>
        <ul className="flex flex-wrap gap-2">
          {property.features?.map((feature, idx) => (
            <li
              key={idx}
              className="bg-gray-100 px-3 py-1 rounded-full text-gray-700 text-sm font-medium"
            >
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Amenities */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">Amenities</h2>
        <ul className="flex flex-wrap gap-2">
          {amenities.map((item, idx) => (
            <li
              key={idx}
              className="bg-gray-50 border px-3 py-1 rounded-lg text-gray-700 text-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Posted Date */}
      <p className="text-sm text-gray-400 mb-6">Posted on: {property.date}</p>

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
              {property.landlordName || "John Doe"}
            </span>
          </div>

          {/* Phone */}
          <div className="flex items-center">
            <span className="w-6 text-gray-500">
              <i className="fas fa-phone-alt"></i>
            </span>
            <span className="font-medium text-gray-700">Phone:</span>
            <span className="ml-2 text-gray-900">
              {property.landlordPhone || "+91-9876543210"}
            </span>
          </div>

          {/* Email */}
          <div className="flex items-center">
            <span className="w-6 text-gray-500">
              <i className="fas fa-envelope"></i>
            </span>
            <span className="font-medium text-gray-700">Email:</span>
            <span className="ml-2 text-gray-900">
              {property.landlordEmail || "landlord@example.com"}
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
}
