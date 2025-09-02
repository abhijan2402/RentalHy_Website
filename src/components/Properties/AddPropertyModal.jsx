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
  Checkbox,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAddPropertyMutation } from "../../redux/api/propertyApi";
import { toast } from "react-toastify";
import { usePropertyFilters } from "../../hooks/usePropertyFilters";

const { Option } = Select;
const { Group: CheckboxGroup } = Checkbox;
const normFile = (e) => {
  // Antd's Upload event normalization for form value
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};
const bhkOptions = ["1RK", "1BHK", "2BHK", "3BHK", "4BHK+", "5BHK+"];

const furnishingOptions = ["Furnished", "Semi-Furnished", "Unfurnished"];

const tenantOptions = ["Family", "Bachelors male", "Bachelors female"];

const AddPropertyModal = ({ showModal, onClose }) => {
  const horizontalScrollClass =
    "flex gap-2 overflow-x-auto flex-nowrap md:overflow-x-visible md:flex-wrap";

  const [addProperty, { isLoading }] = useAddPropertyMutation();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const handleBeforeUpload = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      message.error("You can only upload JPEG, PNG, or JPG image files!");
      return Upload.LIST_IGNORE;
    }
    if (fileList.length >= 5) {
      message.error("You can upload up to 5 images only!"); // corrected message to 5
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(0, 5)); // limit max 5 images
  };

  const onFinish = async (values) => {
    console.log(values);
    if (!values.images || values.images.length === 0) {
      toast.error("Please upload at least one property image.");
      return;
    }

    const validAvailabilityOptions = ["Ready to Move", "Under Construction"];
    const validAdvanceOptions = ["1 month", "2 months", "3 months+"];

    const formData = new FormData();

    try {
      // Add amenities (do this BEFORE looping other fields)
      if (values.amenities) {
        const amenityObj = {};
        values.amenities.forEach(({ amenityKey, amenityValue }) => {
          if (amenityKey) amenityObj[amenityKey] = amenityValue;
        });
        // Append as JSON string (for a key-value object)
        formData.append("amenities", JSON.stringify(amenityObj));
      }

      Object.entries(values).forEach(([key, value]) => {
        if (key === "images" || key === "amenities") return; // skip amenities/images, already added

        if (Array.isArray(value)) {
          if (key === "availability" || key === "advance") {
            const firstValid = value.find((v) =>
              (key === "availability"
                ? validAvailabilityOptions
                : validAdvanceOptions
              ).includes(v)
            );
            if (!firstValid) throw new Error(`Invalid ${key} selected`);
            formData.append(key, firstValid);
          } else {
            value.forEach((val, idx) => {
              formData.append(`${key}[${idx}]`, val);
            });
          }
        } else {
          if (
            key === "availability" &&
            !validAvailabilityOptions.includes(value)
          ) {
            throw new Error("Invalid availability selected");
          }
          if (key === "advance" && !validAdvanceOptions.includes(value)) {
            throw new Error("Invalid advance selected");
          }
          if (key === "price" || key === "area_sqft") {
            formData.append(key, value?.toString() || "");
          } else {
            formData.append(key, value);
          }
        }
      });

      values.images.forEach((fileObj, idx) => {
        const file = fileObj.originFileObj || fileObj;
        formData.append(`images[${idx}]`, file);
      });

      await addProperty(formData)
        .unwrap()
        .then((response) => {
          toast.success(response?.message || "Property created successfully");
          console.log(response);
        })
        .catch((error) => {
          const errMsg =
            error?.data?.message ||
            error?.error ||
            "Failed to add Property. Please try again.";
          toast.error(errMsg);
        });

      form.resetFields();
      setFileList([]);
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to add property. Please try again.");
    }
  };

  return (
    <Modal
      title="Add New Property"
      open={showModal}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Upload Property"
      okButtonProps={{
        style: {
          backgroundColor: "#7C0902",
          borderColor: "#7C0902",
          color: "white",
        },
        disabled: isLoading, // disables button when loading
        loading: isLoading, // shows loading spinner on button when loading
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
          property_type: "",
          bathrooms: "",
          parking: "",
          facing: "",
          bhk: [],
          furnishing_status: [],
          preferred_tenant_type: [],
          availability: "",
          advance: "",
          amenities: [{ amenityKey: "", amenityValue: "" }],
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
        <Form.Item
          label="Preferred Tenant"
          name="preferred_tenant_type"
          rules={[
            {
              required: true,
              message: "Please select at least one tenant type",
            },
          ]}
        >
          <CheckboxGroup options={tenantOptions} />
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
          name="area_sqft"
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
          rules={[
            { required: true, message: "Please select at least one BHK" },
          ]}
        >
          <CheckboxGroup options={bhkOptions} />
        </Form.Item>

        {/* Property Type */}
        <Form.Item
          label="Property Type"
          name="property_type"
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
        <Form.Item
          label="Furnishing Status"
          name="furnishing_status"
          rules={[
            { required: true, message: "Please select furnishing status" },
          ]}
        >
          <CheckboxGroup options={furnishingOptions} />
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
        <Form.Item
          label="Availability"
          name="availability"
          rules={[{ required: true, message: "Please select availability" }]}
        >
          <Radio.Group>
            <Radio value="Ready to Move">Ready to move</Radio>
            <Radio value="Under Construction">Under Construction</Radio>
          </Radio.Group>
        </Form.Item>

        {/* Parking Available */}
        <Form.Item label="Parking Available" name="parking_available">
          <Radio.Group className={horizontalScrollClass}>
            {["Bike", "Car", "Both", "None"].map((opt) => (
              <Radio.Button key={opt} value={opt}>
                {opt}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        {/* Facing */}
        <Form.Item label="Facing" name="facing_direction">
          <Radio.Group className={horizontalScrollClass}>
            {["North", "East", "West", "South"].map((opt) => (
              <Radio.Button key={opt} value={opt}>
                {opt}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        {/* Advance */}
        <Form.Item
          label="Advance"
          name="advance"
          rules={[{ required: true, message: "Please select advance" }]}
        >
          <Radio.Group>
            <Radio value="1 month">1 Month</Radio>
            <Radio value="2 months">2 Months</Radio>
            <Radio value="3 months+">3 Months+</Radio>
          </Radio.Group>
        </Form.Item>

        {/* Amenities */}
        <Form.List name="amenities">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div
                  key={key}
                  style={{ display: "flex", gap: 8, marginBottom: 8 }}
                >
                  <Form.Item
                    {...restField}
                    name={[name, "amenityKey"]}
                    rules={[
                      { required: true, message: "Amenity name required" },
                    ]}
                  >
                    <Input placeholder="Amenity Name (e.g. Death road)" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "amenityValue"]}
                    rules={[
                      { required: true, message: "Amenity value required" },
                    ]}
                  >
                    <Input placeholder="Value (e.g. yes)" />
                  </Form.Item>
                  <Button danger onClick={() => remove(name)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  Add Amenity
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

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

export default AddPropertyModal;
