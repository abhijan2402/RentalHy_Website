import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  UserOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Form, Input, Button, Modal, Tooltip } from "antd";
import { FaHome, FaHeart, FaEye } from "react-icons/fa";
import PropertyAnalytics from "../components/Properties/PropertyAnalytics";
import { propertyData } from "../utils/propertydata";
import Breadcrumb from "../components/Breadcrumb";

export default function ProfilePage() {
  const [editOpen, setEditOpen] = useState(false);
  const user = {
    name: "Jhon",
    email: "jhon@gmail.com",
    phone: "+917867565432",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTNjkaQHLXfokbl1GiKnXl6v7GNgnG8rb3JA&s",
  };

  // Edit form submit
  const handleEditSubmit = (values) => {
    // Save user profile update logic here
    setEditOpen(false);
  };

  // Logout handler
  const handleLogout = () => {
    // Implement your logout logic here, e.g., clearing auth tokens, redirecting, etc.
    console.log("User logged out");
  };

  return (
    <div className="mt-[120px]">
      <Breadcrumb propertyTitle={"Profile"} />
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white rounded-xl shadow-lg p-6 flex items-center gap-6 max-w-full mx-auto"
        >
          <div className="absolute top-4 right-4 flex gap-4">
            <Tooltip title="Edit Profile" placement="topRight">
              <Button
                type="text"
                icon={
                  <EditOutlined style={{ fontSize: 18, color: "#7C0902" }} />
                }
                onClick={() => setEditOpen(true)}
                className="p-1 hover:bg-[#7C0902] hover:text-white rounded-full transition"
              >
                Edit
              </Button>
            </Tooltip>

            <Tooltip title="Logout" placement="topRight">
              <Button
                type="text"
                icon={
                  <LogoutOutlined style={{ fontSize: 18, color: "#7C0902" }} />
                }
                onClick={handleLogout}
                className="p-1 hover:bg-[#7C0902] hover:text-white rounded-full transition"
              >
                Logout
              </Button>
            </Tooltip>
          </div>

          {/* Avatar */}
          <div className="flex-shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="User avatar"
                className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-[#7C0902]"
              />
            ) : (
              <UserOutlined className="w-24 h-24 text-gray-300 p-4 bg-gray-100 rounded-full shadow-md" />
            )}
          </div>

          {/* User info */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-gray-900">
              {user?.name || "John Cena"}
            </h2>
            <p className="text-gray-600 flex items-center gap-2 mt-1">
              <MailOutlined />
              {user?.email || "cantseeme@gmail.com"}
            </p>
            <p className="text-gray-600 flex items-center gap-2 mt-1">
              <PhoneOutlined />
              {user?.phone || "xxxxxxxx34"}
            </p>
          </div>
        </motion.div>

        {/* Edit Profile Modal (Ant Design) */}
        <Modal
          open={editOpen}
          title="Edit Profile"
          onCancel={() => setEditOpen(false)}
          footer={null}
          destroyOnClose
        >
          <Form
            layout="vertical"
            initialValues={user}
            onFinish={handleEditSubmit}
          >
            <Form.Item
              label="Full Name"
              name="name"
              rules={[{ required: true, message: "Please input your name" }]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input prefix={<MailOutlined />} />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                { required: true, message: "Please input your phone number" },
                { min: 10, message: "Phone must be at least 10 digits" },
              ]}
            >
              <Input prefix={<PhoneOutlined />} />
            </Form.Item>
            <Form.Item>
              <Button
                block
                style={{ background: "#7C0902", color: "#fff" }}
                htmlType="submit"
              >
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Property Analytics Section */}
        <div className="mt-8">
          <PropertyAnalytics properties={propertyData} />
        </div>
      </div>
    </div>
  );
}
