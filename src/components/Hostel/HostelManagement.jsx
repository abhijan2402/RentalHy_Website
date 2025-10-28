import React, { useState } from "react";
import { FaHome, FaSpinner } from "react-icons/fa";
import { BiEdit, BiErrorCircle } from "react-icons/bi";
import { TbDatabaseOff } from "react-icons/tb";
import { CiLocationOn } from "react-icons/ci";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import {
  useEditMyHostelCapacityMutation,
  useGetMyHostelListQuery,
} from "../../redux/api/hostelApi";
import { Modal, InputNumber, Button } from "antd";
import { toast } from "react-toastify";

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  adaptiveHeight: true,
};

export default function PropertyAnalytics() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetMyHostelListQuery();
  const [editMyHostelCapacity, { isLoading: isUpdating }] =
    useEditMyHostelCapacityMutation();

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [newCapacity, setNewCapacity] = useState(null);

  const handleEditClick = (property) => {
    setSelectedHostel(property);
    setNewCapacity(property.occupancy_capacity || 0);
    setIsModalOpen(true);
  };

  const handleUpdateCapacity = async () => {
    if (newCapacity === null || newCapacity < 0) {
      toast.error("Please enter a valid capacity");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("seating_capacity", newCapacity); // ✅ append key + value

      await editMyHostelCapacity({
        id: selectedHostel.id,
        body: fd, // ✅ pass as 'body', not 'fd'
      }).unwrap();

      toast.success("Capacity updated successfully!");
      setIsModalOpen(false);
    } catch (err) {
      console.error("Update Error:", err);
      const errMsg =
        err?.data?.message ||
        err?.error ||
        "Failed to update capacity. Please try again.";
      toast.error(errMsg);
    }
  };

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
          <p className="text-lg font-medium">Loading Hostels...</p>
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

    if (data?.data?.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-[60vh] text-gray-500 gap-3"
        >
          <TbDatabaseOff size={50} />
          <p className="text-lg font-medium">No Hotels found</p>
        </motion.div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto flex flex-col gap-6 w-full">
        {/* Property List */}
        <div className="grid md:grid-cols-3 gap-6">
          {data?.data.map((property) => (
            <div
              key={property.id}
              className="bg-white border rounded-xl p-4 shadow flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaHome className="text-gray-400" />
                  <span className="font-medium text-black">
                    {property.title}
                  </span>
                </div>

                <Button
                  type="primary"
                  size="small"
                  onClick={() => handleEditClick(property)}
                  className="bg-[#7C0902] hover:bg-[#600702]"
                  icon={<BiEdit />}
                ></Button>
              </div>

              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <CiLocationOn color="red" />
                <span>{property.location}</span>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <span className="text-blue-600 text-sm">
                  Capacity: {property.seating_capacity || "0"}
                </span>
              </div>

              {/* Image Slider */}
              <div className="py-4">
                <Slider {...sliderSettings}>
                  {(property.images ?? []).map((img, idx) => (
                    <div key={idx} className="w-full">
                      <img
                        src={img?.image_path || "/placeholder.jpg"}
                        alt={property.title}
                        draggable="false"
                        onClick={() =>
                          navigate(`/propertydetails/${property.id}`)
                        }
                        className="w-full h-auto object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-[1.02] sm:h-48 md:h-56 lg:h-64"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-[#7C0902]">My Hotels</h3>
      {renderState()}

      {/* Edit Capacity Modal */}
      <Modal
        title={`Edit Capacity - ${selectedHostel?.title || ""}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleUpdateCapacity}
        okText="Update"
        confirmLoading={isUpdating}
      >
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 text-sm">Seating Capacity</label>
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            value={newCapacity}
            onChange={(value) => setNewCapacity(value)}
          />
        </div>
      </Modal>
    </div>
  );
}
