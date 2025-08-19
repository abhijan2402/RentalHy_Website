import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Button,
  message,
  Radio,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const normFile = (e) => {
  // Antd's Upload event normalization for form value
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

const AddFarmHouse = ({ showModal, onClose }) => {
  const horizontalScrollClass =
    "flex gap-2 overflow-x-auto flex-nowrap md:overflow-x-visible md:flex-wrap";
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const handleBeforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }
    if (fileList.length >= 5) {
      message.error("You can upload up to 10 images only!");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(0, 5)); // limit max 5 images
  };

  const onFinish = (values) => {
    if (!values.images || values.images.length === 0) {
      message.error("Please upload at least one property image.");
      return;
    }
    // Prepare image info (name and uid)
    const imagesInfo = values.images.map((file) => ({
      name: file.name,
      uid: file.uid,
      // optionally url: file.url or preview
    }));

    const dataToSubmit = {
      ...values,
      images: imagesInfo,
    };

    console.log("Submitted data:", dataToSubmit);
    form.resetFields();
    setFileList([]);
    onClose();
  };

  return (
    <Modal
      title="Add New Farm House"
      open={showModal}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Upload Farm House"
      okButtonProps={{
        style: { backgroundColor: "#7C0902", borderColor: "#7C0902" },
      }}
      cancelButtonProps={{
        style: { borderColor: "#7C0902", color: "#7C0902" },
      }}
      width={"800px"}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          bhk: "",
          type: "",
          furnishing: "",
          bathrooms: "",
          availability: "",
          parking: "",
          facing: "",
          advance: "",
          tenant: "",
        }}
      >
        {/* Property Title */}
        <Form.Item
          label="Property Title"
          name="title"
          rules={[{ required: true, message: "Please enter property title" }]}
        >
          <Input placeholder="Enter property title" />
        </Form.Item>

        {/* Description */}
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea placeholder="Enter property description" rows={3} />
        </Form.Item>

        {/* Preferred Tenant */}
        <Form.Item label="Preferred Tenant" name="tenant">
          <Radio.Group className={horizontalScrollClass}>
            {["Family", "Bachelors Male", "Bachelors Female"].map((opt) => (
              <Radio.Button key={opt} value={opt}>
                {opt}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        {/* Price */}
        <Form.Item
          label="Price"
          name="price"
          rules={[
            { required: true, message: "Please enter price" },
            { type: "number", min: 0, message: "Price must be non-negative" },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Enter price"
            min={0}
            formatter={(value) => `₹ ${value}`}
            parser={(value) => value.replace(/\₹\s?|(,*)/g, "")}
          />
        </Form.Item>

        {/* Location
         */}
        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: "Please enter location" }]}
        >
          <Input placeholder="Enter location" />
        </Form.Item>

        {/* Area Sq.ft */}
        <Form.Item
          label="Area (sq ft)"
          name="area"
          rules={[{ type: "number", min: 0, message: "Area must be positive" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Enter area in sq ft"
            min={0}
          />
        </Form.Item>

        {/* BHK */}
        <Form.Item
          label="BHK"
          name="bhk"
          rules={[{ required: true, message: "Please select BHK" }]}
        >
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            className="w-full flex-row-scroll"
          >
            <Radio.Button value="1RK">1RK</Radio.Button>
            <Radio.Button value="1BHK">1BHK</Radio.Button>
            <Radio.Button value="2BHK">2BHK</Radio.Button>
            <Radio.Button value="3BHK">3BHK</Radio.Button>
            <Radio.Button value="4BHK+">4BHK</Radio.Button>
            <Radio.Button value="4BHK+">5BHK+</Radio.Button>
          </Radio.Group>
        </Form.Item>

        {/* Property Type */}
        <Form.Item
          label="Property Type"
          name="type"
          rules={[{ required: true, message: "Please select property type" }]}
        >
          <Radio.Group className={horizontalScrollClass}>
            {["Apartment", "Flat", "Villa"].map((opt) => (
              <Radio.Button key={opt} value={opt}>
                {opt}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        {/* Furnishing Status */}
        <Form.Item label="Furnishing Status" name="furnishing">
          <Radio.Group className={horizontalScrollClass}>
            {["Furnished", "Semi-furnished", "Unfurnished"].map((opt) => (
              <Radio.Button key={opt} value={opt}>
                {opt}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        {/* Bathrooms */}
        <Form.Item label="Bathrooms" name="bathrooms">
          <Radio.Group className={horizontalScrollClass}>
            {["1", "2", "3", "4+"].map((opt) => (
              <Radio.Button key={opt} value={opt}>
                {opt}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        {/* Availability */}
        <Form.Item label="Availability" name="availability">
          <Radio.Group className={horizontalScrollClass}>
            {["Ready to move", "Under Construction"].map((opt) => (
              <Radio.Button key={opt} value={opt}>
                {opt}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        {/* Parking Available */}
        <Form.Item label="Parking Available" name="parking">
          <Radio.Group className={horizontalScrollClass}>
            {["Bike", "Car", "Both", "None"].map((opt) => (
              <Radio.Button key={opt} value={opt}>
                {opt}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        {/* Facing */}
        <Form.Item label="Facing" name="facing">
          <Radio.Group className={horizontalScrollClass}>
            {["North", "East", "West", "South", "NE", "NW", "SE", "SW"].map(
              (opt) => (
                <Radio.Button key={opt} value={opt}>
                  {opt}
                </Radio.Button>
              )
            )}
          </Radio.Group>
        </Form.Item>

        {/* Advance */}
        <Form.Item label="Advance" name="advance">
          <Radio.Group className={horizontalScrollClass}>
            {["1 Month", "2 Months", "3+ Months"].map((opt) => (
              <Radio.Button key={opt} value={opt}>
                {opt}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        {/* Images Upload */}
        <Form.Item
          label="Property Images (1-10)"
          name="images"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
              message: "Please upload at least one image.",
            },
            {
              validator: (_, value) =>
                value && value.length > 10
                  ? Promise.reject(
                      new Error("You can upload up to 10 images only.")
                    )
                  : Promise.resolve(),
            },
          ]}
        >
          <Upload
            listType="picture-card"
            multiple
            beforeUpload={handleBeforeUpload}
            onChange={handleChange}
            fileList={fileList}
            maxCount={10}
            accept="image/*"
          >
            {fileList.length >= 10 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddFarmHouse;
