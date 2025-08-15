import React from "react";
import { FaHome, FaHeart, FaEye } from "react-icons/fa";
// For simplicity, no map – but you can use react-leaflet or google-maps-react for a real map

export default function PropertyAnalytics({ properties }) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Your Property Analytics</h3>
      {properties.length === 0 ? (
        <p className="text-gray-400">No properties found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white border rounded-xl p-4 shadow flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <FaHome className="text-gray-400" />
                <span className="font-semibold">{property.title}</span>
                <span className="ml-auto text-sm text-gray-500">
                  {property.location}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-blue-600">
                  <FaEye /> {property.views || "408"} Views
                </span>
                <span className="flex items-center gap-1 text-pink-700">
                  <FaHeart /> {property.saved || "120"} Saved
                </span>
              </div>
              {/* Property thumbnail or preview */}
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-36 object-cover rounded-lg mt-2"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
