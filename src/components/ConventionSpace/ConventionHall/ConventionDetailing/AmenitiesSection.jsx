import { motion } from "framer-motion";

// Utility: convert key names into readable labels
const formatLabel = (key) => {
  return key
    .replace(/_/g, " ") // replace underscores with spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize words
};

export const AmenitiesSection = ({ property }) => {
  // Pick only boolean keys with true values
  const amenities = Object.entries(property || {}).filter(
    ([, value]) => value === true
  );

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-black mb-4">Amenities</h2>

      {/* User note */}
      <p className="text-sm text-gray-500 italic mb-4">
        <span className="text-lg font-medium text-[#7C0902]">Note:</span> Only
        the amenities that are{" "}
        <span className="font-bold text-green-600 px-1">Available</span> 
         are shown below. If nothing is listed, this property does not provide
        any amenities.
      </p>

      {amenities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {amenities.map(([key], idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="relative flex items-center p-4 rounded-xl border 
                         bg-green-50 border-green-400 text-green-700 text-center"
            >
              {/* Tag */}
              <span
                className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full 
                           font-medium bg-green-600 text-white"
              >
                Available
              </span>

              {/* Label */}
              <span className="text-sm font-medium">{formatLabel(key)}</span>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500 border border-gray-300 rounded-xl bg-gray-50">
          🚫 No amenities available for this property.
        </div>
      )}
    </div>
  );
};
