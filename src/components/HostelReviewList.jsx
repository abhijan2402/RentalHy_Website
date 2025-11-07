import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
import { BiErrorCircle } from "react-icons/bi";
import { TbDatabaseOff } from "react-icons/tb";
import { Button, Modal } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { useGetHostelReviewListQuery } from "../redux/api/feedbackApi";

export default function HostelReviewList() {
  const [activeHostel, setActiveHostel] = useState(null);
  const { data, isLoading, error } = useGetHostelReviewListQuery();

  const renderState = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-600 gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <FaSpinner size={40} className="text-[#7C0902]" />
          </motion.div>
          <p className="text-lg font-medium">Loading hostels...</p>
        </div>
      );
    }

    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center h-[60vh] text-red-600 gap-3"
        >
          <BiErrorCircle size={50} />
          <p className="text-lg font-semibold">Something went wrong</p>
          <p className="text-sm text-gray-500">Please try again later</p>
        </motion.div>
      );
    }

    if (!data?.data || data?.data.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-[60vh] text-gray-500 gap-3"
        >
          <TbDatabaseOff size={50} />
          <p className="text-lg font-medium">No hostels found</p>
        </motion.div>
      );
    }

    // ✅ Multiple hostel cards
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {data.data.map((item, index) => {
          const hostel = item.hostel_details;
          const reviews = item.reviews || [];
          const stats = item.review_statistics || {};
          const image =
            hostel.images && hostel.images.length > 0
              ? hostel.images[0].image_path
              : "https://via.placeholder.com/400x250?text=No+Image";

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Hostel Image */}
              <img
                src={image}
                alt={hostel.title}
                className="w-full h-48 object-cover"
              />

              {/* Hostel Info */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#7C0902] mb-1">
                    {hostel.title}
                  </h2>
                  <a
                    href={hostel.map_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-sm flex items-center gap-1 mb-3"
                  >
                    <EnvironmentOutlined />
                    {hostel.location || "Unknown location"}
                  </a>

                  {/* Review Stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                    <div>
                      <span className="font-semibold text-[#7C0902]">
                        {stats.total_reviews}
                      </span>{" "}
                      reviews
                    </div>
                    <div>Food: {stats.food_positive_percentage}%</div>
                    <div>Room: {stats.room_positive_percentage}%</div>
                    <div>Staff: {stats.staff_positive_percentage}%</div>
                    <div>Safety: {stats.safety_positive_percentage}%</div>
                  </div>

                  {/* Recent Reviews */}
                  {reviews.length > 0 ? (
                    <div className="space-y-2 text-sm">
                      {reviews.slice(0, 2).map((r, i) => (
                        <div
                          key={i}
                          className="bg-gray-50 border p-2 rounded-lg"
                        >
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{r.user?.name || "Anonymous"}</span>
                            <span>
                              {new Date(r.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="font-medium">{r.title}</div>
                          <div className="text-gray-700 text-xs line-clamp-2">
                            {r.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm italic">
                      No reviews yet
                    </p>
                  )}
                </div>

                {/* View More */}
                {reviews.length > 2 && (
                  <Button
                    type="primary"
                    className="mt-4"
                    onClick={() => setActiveHostel(item)}
                  >
                    View All Reviews
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* <h1 className="text-2xl font-bold text-center py-4 text-[#7C0902]">
        Hostel Reviews
      </h1> */}
      {renderState()}

      {/* 🔹 Modal for Full Review View */}
      <Modal
        open={!!activeHostel}
        onCancel={() => setActiveHostel(null)}
        footer={[
          <Button key="close" onClick={() => setActiveHostel(null)}>
            Close
          </Button>,
        ]}
        width={900}
        title={
          activeHostel ? (
            <div className="flex items-center gap-2">
              {activeHostel.hostel_details.title}
              <EnvironmentOutlined style={{ color: "#1890ff" }} />
            </div>
          ) : null
        }
      >
        {activeHostel && (
          <div
            className="grid md:grid-cols-2 gap-6 mb-4"
            style={{ maxHeight: "60vh", overflowY: "auto" }}
          >
            <div>
              {activeHostel.reviews.length === 0 ? (
                <div className="text-gray-500">No reviews available.</div>
              ) : (
                activeHostel.reviews.map((review, i) => (
                  <div
                    key={i}
                    className="bg-white border rounded-lg p-3 mb-3 shadow-sm"
                  >
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">
                        {review.user?.name || "Anonymous"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="font-medium text-sm mb-1">
                      {review.title}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {review.description}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div>
              <iframe
                title="Hostel Location"
                width="100%"
                height={300}
                style={{ border: 0, borderRadius: 8 }}
                src={`https://www.google.com/maps?q=${activeHostel.hostel_details.lat},${activeHostel.hostel_details.long}&hl=en&z=15&output=embed`}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
