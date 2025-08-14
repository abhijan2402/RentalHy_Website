import React from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const images = [
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
  "https://images.unsplash.com/photo-1501183638710-841dd1904471",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
];

export default function WhyChooseUs() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
  };

  return (
    <section className="bg-gradient-to-br from-white via-gray-50 to-gray-100 py-20 px-6 md:px-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Overlapping Slider */}
        <div className="relative w-full flex justify-center">
          {/* Background static image */}
          <motion.img
            src="https://images.unsplash.com/photo-1505691938895-1758d7feb511"
            alt="Luxury Apartment"
            className="w-72 h-96 object-cover rounded-lg shadow-lg absolute top-8 left-8 opacity-80"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          />
          {/* Foreground slider */}
          <motion.div
            className="w-80 h-[420px] relative z-10 rounded-lg overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Slider {...settings}>
              {images.map((img, i) => (
                <div key={i}>
                  <img
                    src={img}
                    alt={`Property ${i + 1}`}
                    className="w-full h-[420px] object-cover"
                  />
                </div>
              ))}
            </Slider>
          </motion.div>
        </div>

        {/* Text Section */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#012A56]">
            Why Choose <span className="text-[#7C0902]">Us?</span>
          </h2>
          <p className="text-gray-700 leading-relaxed">
            At Stay, we go beyond listings — we help you find a place you’ll
            truly call home. From luxury apartments to cozy family houses, our
            expert agents, transparent pricing, and personalized service make
            the journey smooth and stress-free.
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>🏆 Award-winning real estate service</li>
            <li>📍 Local market expertise in prime areas</li>
            <li>🤝 Personalized guidance from search to closing</li>
            <li>💼 Trusted by 1,000+ happy homeowners</li>
          </ul>
          <motion.button
            className="border-2 border-[#7C0902] text-[#7C0902] px-6 py-3 rounded-md hover:bg-[#7C0902] hover:text-white transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </div>
      </div>
    </section>
  );
}
