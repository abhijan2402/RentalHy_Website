import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  UserOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Form, Input, Button, Modal, Tooltip, Upload, Tabs } from "antd";
import { FaHome, FaHeart, FaEye } from "react-icons/fa";
import PropertyAnalytics from "../components/Properties/PropertyAnalytics";
import { propertyData } from "../utils/propertydata";
import Breadcrumb from "../components/Breadcrumb";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { BiPhone } from "react-icons/bi";

import {
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
} from "../redux/api/profileApi";
import MyBookings from "../components/MyBookings";
import Bookings from "../components/Bookings";
import Account from "../components/Account";

const { TabPane } = Tabs;

export default function ProfilePage() {
  const { user, logout, setUser } = useAuth();

  const [editOpen, setEditOpen] = useState(false);
  const [imageEditOpen, setImageEditOpen] = useState(false);

  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
  const [uploadImage, { isLoading: uploading }] =
    useUploadProfileImageMutation();

  const [form] = Form.useForm();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.avatar || null);
  console.log(imageFile);
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone_number || "",
      });
      setImagePreview(user.avatar || null);
    }
  }, [user, form]);

  // Handle profile update submit
  const handleEditSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phone_number", values.phone);

      const res = await updateProfile(formData).unwrap();
      console.log(res);
      if (res && res.message) {
        toast.success("Profile updated successfully");
        setEditOpen(false);
        localStorage.setItem("user", JSON.stringify(res.user));
        setUser(res.user);
      }
    } catch (err) {
      toast.error(err.data?.message || "Error updating profile");
    }
  };

  const handleImageChange = (info) => {
    if (info.file.status === "removed") {
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    if (info.file) {
      const file = info.file;
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    toast.success("Logout Successfully..!!");
  };

  return (
    <div className="mt-[120px]">
      <Breadcrumb propertyTitle={"Profile"} />
      <div className="max-w-6xl mx-auto p-6">
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

          {/* Avatar with edit button overlay */}
          <div className="relative flex-shrink-0">
            {user?.image &&
            user?.image !==
              "https://hotpink-rook-901841.hostingersite.com/storage/uploads/User-image/noimage.png" ? (
              <img
                src={user?.image}
                alt="User avatar"
                className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-[#7C0902]"
              />
            ) : (
              <UserOutlined className="w-24 h-24 text-gray-300 p-4 bg-gray-100 rounded-full shadow-md" />
            )}
            <Tooltip title="Edit Profile Image" placement="bottom">
              <button
                onClick={() => setImageEditOpen(true)}
                className="absolute bottom-0 left-1 bg-[#7C0902] hover:bg-[#600601] text-white rounded-sm  px-2 py-1 shadow transition"
              >
                <EditOutlined style={{ fontSize: 16 }} />
              </button>
            </Tooltip>
          </div>

          <div className="flex flex-col justify-center px-3 sm:px-0">
            <h2 className="text-lg sm:text-2xl font-semibold text-gray-900 break-words">
              {user?.name || "Rohan"}
            </h2>

            <p className="text-gray-600 flex items-center gap-2 mt-1 text-sm sm:text-base break-all">
              <MailOutlined className="text-base sm:text-lg" />
              {user?.email || "cantseeme@gmail.com"}
            </p>

            <p className="text-gray-600 flex items-center gap-2 mt-1 text-sm sm:text-base break-all">
              <BiPhone className="text-base sm:text-lg" />
              {user?.phone_number || "xxxxxxxx34"}
            </p>
          </div>
        </motion.div>

        {/* Tabs for different property types */}
        <Tabs defaultActiveKey="myProperty" className="mt-8">
          <TabPane tab="My Property" key="myProperty">
            <PropertyAnalytics />
          </TabPane>
          <TabPane tab="My Bookings" key="myBookings">
            <MyBookings />
          </TabPane>
          <TabPane tab="Bookings" key="bookings">
            <Bookings />
          </TabPane>
          <TabPane tab="Account" key="account">
            <Account />
          </TabPane>
          {/* <TabPane tab="Convention / Function Hall" key="conventionHall">
            <div className="flex border border-dashed border-[#7C0902] rounded text-[#7C0902] justify-center items-center h-[100px]">
              Coming Soon..
            </div>
          </TabPane>
          <TabPane tab="Resort / Farm House" key="resortFarmHouse">
            <div className="flex border border-dashed border-[#7C0902] rounded text-[#7C0902] justify-center items-center h-[100px]">
              Coming Soon..
            </div>
          </TabPane>
          <TabPane tab="Hotels" key="hotels">
            <div className="flex border border-dashed border-[#7C0902] rounded text-[#7C0902] justify-center items-center h-[100px]">
              Coming Soon..
            </div>
          </TabPane> */}
        </Tabs>
      </div>

      {/* Profile Deatails Upload */}
      <Modal
        open={editOpen}
        title="Edit Profile"
        onCancel={() => setEditOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={handleEditSubmit}>
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
            <Input prefix={<BiPhone />} />
          </Form.Item>

          <Form.Item>
            <Button
              block
              style={{ background: "#7C0902", color: "#fff" }}
              htmlType="submit"
              loading={updating || uploading}
              disabled={updating || uploading}
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* Profile Image upload */}
      <Modal
        open={imageEditOpen}
        title="Edit Profile Image"
        onCancel={() => setImageEditOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Upload
          listType="picture-card"
          maxCount={1}
          beforeUpload={() => false}
          onChange={handleImageChange}
          onRemove={() => {
            setImageFile(null);
            setImagePreview(null);
          }}
        >
          {imagePreview ? null : "+"}
        </Upload>
        <Button
          type="primary"
          onClick={async () => {
            if (!imageFile) {
              toast.error("Please select an image to upload");
              return;
            }

            try {
              const imageFormData = new FormData();
              imageFormData.append("image", imageFile);

              // unwrap will return full API response
              const res = await uploadImage(imageFormData).unwrap();

              if (res?.status === "success") {
                toast.success(
                  res.message || "Profile image updated successfully"
                );

                setUser(res.user);

                setImageEditOpen(false);
              }
            } catch (error) {
              toast.error(
                error?.data?.message || "Failed to update profile image"
              );
            }
          }}
          disabled={!imageFile}
          className="mt-4 w-full"
        >
          Upload Image
        </Button>
      </Modal>
    </div>
  );
}
