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

const AddPropertyModal = ({ showModal, onClose }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const handleBeforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }
    if (fileList.length >= 5) {
      message.error("You can upload up to 5 images only!");
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
      title="Add New Property"
      open={showModal}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Save Property"
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
        <Form.Item
          label="Property Title"
          name="title"
          rules={[{ required: true, message: "Please enter property title" }]}
        >
          <Input placeholder="Enter property title" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea placeholder="Enter property description" rows={3} />
        </Form.Item>

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

        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: "Please enter location" }]}
        >
          <Input placeholder="Enter location" />
        </Form.Item>

        <Form.Item
          label="Area (sq ft)"
          name="area"
          rules={[
            { required: true, message: "Please enter area" },
            { type: "number", min: 0, message: "Area must be positive" },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Enter area in sq ft"
            min={0}
          />
        </Form.Item>

        <Form.Item
          label="BHK"
          name="bhk"
          rules={[{ required: true, message: "Please select BHK" }]}
        >
          <Select placeholder="Select BHK">
            <Option value="1RK">1RK</Option>
            <Option value="1BHK">1BHK</Option>
            <Option value="2BHK">2BHK</Option>
            <Option value="3BHK">3BHK</Option>
            <Option value="4BHK+">4BHK+</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Property Type"
          name="type"
          rules={[{ required: true, message: "Please select property type" }]}
        >
          <Select placeholder="Select property type">
            <Option value="Apartment">Apartment</Option>
            <Option value="Flat">Flat</Option>
            <Option value="Villa">Villa</Option>
          </Select>
        </Form.Item>

        {/* Add optional selects with no required */}
        <Form.Item label="Furnishing Status" name="furnishing">
          <Select placeholder="Select furnishing status" allowClear>
            <Option value="Furnished">Furnished</Option>
            <Option value="Semi-furnished">Semi-furnished</Option>
            <Option value="Unfurnished">Unfurnished</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Bathrooms" name="bathrooms">
          <Select placeholder="Select bathrooms" allowClear>
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
            <Option value="4+">4+</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Availability" name="availability">
          <Select placeholder="Select availability" allowClear>
            <Option value="Ready to move">Ready to move</Option>
            <Option value="Under Construction">Under Construction</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Parking Available" name="parking">
          <Select placeholder="Select parking availability" allowClear>
            <Option value="Bike">Bike</Option>
            <Option value="Car">Car</Option>
            <Option value="Both">Both</Option>
            <Option value="None">None</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Facing" name="facing">
          <Select placeholder="Select facing direction" allowClear>
            <Option value="North">North</Option>
            <Option value="East">East</Option>
            <Option value="West">West</Option>
            <Option value="South">South</Option>
            <Option value="NE">NE</Option>
            <Option value="NW">NW</Option>
            <Option value="SE">SE</Option>
            <Option value="SW">SW</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Advance" name="advance">
          <Select placeholder="Select advance" allowClear>
            <Option value="1 Month">1 Month</Option>
            <Option value="2 Months">2 Months</Option>
            <Option value="3+ Months">3+ Months</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Preferred Tenant" name="tenant">
          <Select placeholder="Select preferred tenant" allowClear>
            <Option value="Family">Family</Option>
            <Option value="Bachelors Male">Bachelors Male</Option>
            <Option value="Bachelors Female">Bachelors Female</Option>
          </Select>
        </Form.Item>

        {/* Images Upload */}
        <Form.Item
          label="Property Images (1-5)"
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
                value && value.length > 5
                  ? Promise.reject(
                      new Error("You can upload up to 5 images only.")
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
            maxCount={5}
            accept="image/*"
          >
            {fileList.length >= 5 ? null : (
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

export default AddPropertyModal;
