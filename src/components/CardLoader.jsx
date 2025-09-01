import React from "react";
import { motion } from "framer-motion";

// Card skeleton variations for grid/list display
const cardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const CardLoader = ({ count = 3 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {[...Array(count)].map((_, idx) => (
      <motion.div
        key={idx}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        className="bg-gray-100 rounded-xl shadow-lg p-6 flex flex-col gap-4 w-full h-72 animate-pulse"
      >
        <div className="bg-gray-300 h-32 w-full rounded-lg" />
        <div className="h-4 bg-gray-300 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </motion.div>
    ))}
  </div>
);

export default CardLoader;
