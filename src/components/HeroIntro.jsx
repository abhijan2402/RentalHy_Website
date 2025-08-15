import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAuth } from "../contexts/AuthContext";

const HeroIntro = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
  };

  return (
    <section className="min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-10 bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Text Section */}
      <motion.div
        className="max-w-xl mb-12 md:mb-0"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          Unlock the Door to Your{" "}
          <span className="text-[#7C0902]">Perfect Home</span>
        </h1>
        <p className="text-gray-700 text-lg mb-8">
          Explore premium homes, apartments, and commercial spaces curated for
          your lifestyle. Your journey to the perfect property starts here.
        </p>

        {/* Buttons */}
        {!user && (
          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/signup")}
              className="px-6 py-3 bg-[#7C0902] text-white rounded-lg text-lg font-semibold shadow-md hover:bg-opacity-90 transition"
            >
              Sign Up
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/signin")}
              className="px-6 py-3 border-2 border-[#7C0902] text-[#7C0902] rounded-lg text-lg font-semibold hover:bg-[#7C0902] hover:text-white transition"
            >
              Login
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Image Slider Section */}
      <motion.div
        className="w-full md:w-1/2"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Slider {...sliderSettings} className="rounded-xl shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1560185127-6ed189bf02f4"
            alt="Luxury Home"
            className="w-full h-[400px] object-cover rounded-xl"
          />
          <img
            src="https://www.michaelzingraf.com/storage/images/xOWyG9KJ1jqmMPFgv1KoscsYpkoQ0lCDD2WTi8WE.jpeg"
            alt="Modern Apartment"
            className="w-full h-[400px] object-cover rounded-xl"
          />
          <img
            src="https://images.unsplash.com/photo-1505691938895-1758d7feb511"
            alt="Commercial Space"
            className="w-full h-[400px] object-cover rounded-xl"
          />
        </Slider>
      </motion.div>
    </section>
  );
};

export default HeroIntro;
