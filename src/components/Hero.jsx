import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const images = [
  "https://images.unsplash.com/photo-1560185127-6ed189bf02f4", // property image 1
  "https://www.michaelzingraf.com/storage/images/xOWyG9KJ1jqmMPFgv1KoscsYpkoQ0lCDD2WTi8WE.jpeg", // property image 2
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511", // property image 3
];

export default function Hero() {
  const { user } = useAuth();
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="Home"
      className="relative min-h-[65vh] flex items-center justify-center flex-col px-4 text-center pt-28 bg-cover bg-center overflow-hidden"
    >
      {/* Background Image Slider */}
      {images.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70 z-0" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-snug"
        >
          From Dreams to Deeds – Find Your{" "}
          <span className="text-[#f44137]">Next Address</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-4 text-base sm:text-lg md:text-xl text-white opacity-90"
        >
          Explore the best homes, apartments, and commercial spaces curated for
          your needs. Your journey to the perfect property starts here.
        </motion.p>

        {/* Buttons */}
        {/* {!user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-3 rounded-lg bg-[#7C0902] text-white font-medium shadow-lg hover:bg-opacity-90 transition w-40"
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate("/signin")}
              className="px-6 py-3 rounded-lg border-2 border-white text-white font-medium hover:bg-white hover:text-[#7C0902] transition w-40"
            >
              Login
            </button>
          </motion.div>
        )} */}
      </div>
    </section>
  );
}
