import { useState } from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaClock,
  FaShieldAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaChartLine,
} from "react-icons/fa";

const sliderImages = [
  "https://images.unsplash.com/photo-1560185127-6ed189bf02f4",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  adaptiveHeight: true,
  autoplay: true,
  autoplaySpeed: 4000,
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 mt-16 max-w-7xl mx-auto flex flex-col gap-16">
      {/* Top Section: Header + Slider */}
      <div className="md:flex md:gap-12 items-center">
        {/* Left Header Details */}
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h1 className="text-4xl font-extrabold text-[#7C0902] mb-4 leading-tight">
            About Us
          </h1>
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            To-Let India is a rental platform designed to simplify and enhance
            the way people find, list, and book rental properties across India.
            Our free app and website provide seamless access to a wide range of
            rentals including residential homes, hostels, convention and
            function halls, resorts, and farmhouses. We empower property owners
            and customers with a user-friendly, rental-free listing experience
            and streamlined booking options, including advance payments for
            event spaces and all type of venues. Founded with the vision to
            create an inclusive, transparent, and efficient rental marketplace,
            To-Let India brings together technology and customer-centric design
            to facilitate trusted connections between tenants, hosts, and venue
            owners. Our platform prioritizes user privacy and data security
            while ensuring compliance with India’s legal framework and global
            data protection standards. We are committed to continuous
            innovation, reliable service, and fostering a vibrant community
            where every user can discover the perfect rental solution with
            confidence and ease.
          </p>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex items-center gap-3 bg-white p-4 rounded-lg  hover:shadow-lg transition-shadow cursor-pointer">
              <FaPhoneAlt className="text-[#7C0902] text-2xl" />
              <div>
                <p className="font-semibold text-gray-800">Call Us</p>
                <a
                  href="tel:+919876543210"
                  className="text-gray-600 hover:text-[#7C0902] transition"
                >
                  +91 9014988451
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-lg  hover:shadow-lg transition-shadow cursor-pointer">
              <FaEnvelope className="text-[#7C0902] text-2xl" />
              <div>
                <p className="font-semibold text-gray-800">Email Us</p>
                <a
                  href="mailto:sridharmudhiraj@to-letindia.com
"
                  className="text-gray-600 hover:text-[#7C0902] transition"
                >
                  sridharmudhiraj@to-letindia.com
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Image Slider */}
        <motion.div
          className="md:w-1/2 mt-10 md:mt-0 max-w-lg mx-auto rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Slider {...sliderSettings}>
            {sliderImages.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Property ${idx + 1}`}
                className="w-full h-[400px] object-cover rounded-xl select-none"
                draggable="false"
              />
            ))}
          </Slider>
        </motion.div>
      </div>

      {/* Why Choose Us Section */}
      <div>
        <motion.h2
          className="text-3xl font-bold text-[#7C0902] mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Why Choose Us ?
        </motion.h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <motion.div
            className="flex flex-col items-center text-center bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-default"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <FaShieldAlt className="text-[#7C0902] text-5xl mb-4" />
            <h3 className="font-semibold mb-2 text-lg">Secure & Trusted</h3>
            <p className="text-gray-600 text-sm max-w-xs">
              We prioritize your data privacy and property safety with top-notch
              security.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center text-center bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-default"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <FaClock className="text-[#7C0902] text-5xl mb-4" />
            <h3 className="font-semibold mb-2 text-lg">24/7 Support</h3>
            <p className="text-gray-600 text-sm max-w-xs">
              Our experts are always ready to assist you anytime, anywhere.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center text-center bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-default"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <FaUsers className="text-[#7C0902] text-5xl mb-4" />
            <h3 className="font-semibold mb-2 text-lg">Customer Focused</h3>
            <p className="text-gray-600 text-sm max-w-xs">
              Personalized property recommendations tailored just for you.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center text-center bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-default"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <FaChartLine className="text-[#7C0902] text-5xl mb-4" />
            <h3 className="font-semibold mb-2 text-lg">Innovative Solutions</h3>
            <p className="text-gray-600 text-sm max-w-xs">
              Cutting-edge tech making property dealings seamless and efficient.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
