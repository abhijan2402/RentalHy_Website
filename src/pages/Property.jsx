import React from "react";
import { motion } from "framer-motion";
import { FaBuilding } from "react-icons/fa";

const Property = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center bg-white p-10 rounded-xl shadow-lg max-w-md"
      >
        {/* Animated Icon */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="flex justify-center mb-4"
        >
          <FaBuilding className="text-[#7C0902]" size={64} />
        </motion.div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-[#7C0902] mb-2">
          Convention Hall Section
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-lg mb-6">
          This section is under construction and will be available soon.
        </p>

       
      </motion.div>
    </div>
  );
};

export default Property;
