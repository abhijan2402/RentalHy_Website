import Slider from "react-slick";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const properties = [
  {
    title: "Luxury Villa with Ocean View",
    location: "Malibu, California",
    price: "$4,200,000",
    features: ["5 Beds", "4 Baths", "Swimming Pool"],
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    link: "#",
  },
  {
    title: "Modern Apartment in the City",
    location: "New York, NY",
    price: "$980,000",
    features: ["2 Beds", "2 Baths", "Gym Access"],
    image:
      "https://www.michaelzingraf.com/storage/images/xOWyG9KJ1jqmMPFgv1KoscsYpkoQ0lCDD2WTi8WE.jpeg",
    link: "#",
  },
  {
    title: "Cozy Family Home",
    location: "Austin, Texas",
    price: "$450,000",
    features: ["3 Beds", "2 Baths", "Garden"],
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
    link: "#",
  },
  {
    title: "Penthouse with Skyline View",
    location: "Chicago, Illinois",
    price: "$2,500,000",
    features: ["4 Beds", "3 Baths", "Rooftop Terrace"],
    image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4",
    link: "#",
  },
  {
    title: "Countryside Retreat",
    location: "Napa Valley, California",
    price: "$1,200,000",
    features: ["3 Beds", "2 Baths", "Vineyard"],
    image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115",
    link: "#",
  },
];

// Custom arrow components
const CustomNextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-[#7C0902] text-white p-2 rounded-sm hover:bg-opacity-90 transition text-xl"
  >
    <FaArrowRight />
  </button>
);

const CustomPrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-[#7C0902] text-white p-2 rounded-sm hover:bg-opacity-90 transition text-xl"
  >
    <FaArrowLeft />
  </button>
);

const settings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  nextArrow: <CustomNextArrow />,
  prevArrow: <CustomPrevArrow />,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2 } },
    { breakpoint: 640, settings: { slidesToShow: 1 } },
  ],
};

export default function FeaturedProperties() {
  return (
    <section
      id="FeaturedProperties"
      className="py-20 px-6 bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-800"
    >
      <div className="max-w-6xl mx-auto relative">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-[#7C0902]"
        >
          Featured Properties
        </motion.h2>

        <p className="text-base sm:text-lg md:text-xl text-center text-gray-600 max-w-4xl mx-auto mb-12">
          Discover our handpicked selection of premium properties for sale and
          rent.
        </p>

        <Slider {...settings}>
          {properties.map((property, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="px-4"
            >
              <div className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-[#7C0902]">
                    {property.title}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <FaMapMarkerAlt className="mr-2 text-[#7C0902]" />
                    {property.location}
                  </div>
                  <p className="text-lg font-bold text-gray-900 mb-3">
                    {property.price}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.features.map((feature, i) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <a
                    href={property.link}
                    className="block w-full text-center bg-[#7C0902] text-white py-2 rounded-lg font-semibold hover:bg-opacity-90 transition"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
