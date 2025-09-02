import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  message,
  Radio,
  DatePicker,
  Space,
  Row,
  Col,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { useAddConventionMutation } from "../../../redux/api/conventionApi";
import { toast } from "react-toastify";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

const maxImages = 5;

const amenitiesOptions = [
  { label: "CCTV Available", name: "cctv_available" },
  { label: "Sound System Available", name: "sound_system_available" },
  { label: "Sound System Allowed", name: "sound_system_allowed" },
  { label: "Adult Games", name: "adult_games" },
  {
    label: "Kitchen Setup with All Materials",
    name: "kitchen_setup_all_materials",
  },
  { label: "Free Cancellation", name: "free_cancellation" },
  { label: "Pay Later", name: "pay_later" },
  { label: "Child Pool", name: "child_pool" },
  { label: "Security Guard", name: "security_guard" },
  { label: "Pet Friendly", name: "pet_friendly" },
  { label: "Breakfast Included", name: "breakfast_included" },
  { label: "Restaurant", name: "restaurant" },
  { label: "Cafeteria", name: "cafeteria" },
  { label: "Elevator", name: "elevator" },
  { label: "24 Hours Reception", name: "reception_24_hours" },
  { label: "Gym / Fitness Available", name: "gym_fitness_available" },
  { label: "A/C Available", name: "ac_available" },
  { label: "Meeting Room", name: "meeting_room" },
  { label: "Free Wifi", name: "free_wifi" },
  { label: "Playground", name: "playground" },
  { label: "Children Games", name: "children_games" },
  { label: "Spa", name: "spa" },
  { label: "Wellness Center", name: "wellness_center" },
  { label: "Wheelchair Access", name: "wheelchair_access" },
  // Placeholder for additional others:
  { label: "Others (if any)", name: "others" },
];
const standardPriceOptions = [
  "Day Visit",
  "Night Visit",
  "24 Hours Visit",
  "Corporate Outing",
  "Banquet Hall Charges",
  "Occasion Charges",
];
// convert into label/value objects
const priceOptions = standardPriceOptions.map((opt) => ({
  label: opt,
  value: opt.toLowerCase().replace(/\s+/g, "_") + "_price",
}));
const yesNoOptions = [
  { label: "Yes", value: "1" },
  { label: "No", value: "0" },
];

const AddFarmHouse = ({ showModal, onClose }) => {
  const [form] = Form.useForm();
  const [addConvention, { error, isLoading }] = useAddConventionMutation();

  const [farmImages, setfarmImages] = useState([]);
  const [roomImages, setroomImages] = useState([]);

  const [selectedDates, setSelectedDates] = useState([]);
  // Store unavailable dates as array of moments (can be individual or ranges)
  const [unavailableDatesRanges, setUnavailableDatesRanges] = useState([]);

  const handleBeforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleChangeFactory =
    (setFn) =>
    ({ fileList }) => {
      setFn(fileList.slice(0, maxImages));
    };

  // Disable dates that are already selected
  const disabledDate = (current) => {
    if (!current) return false;
    return selectedDates.some((date) => date.isSame(current, "day"));
  };

  // On date pick, toggle selection
  const onDateChange = (date) => {
    if (!date) return;
    setSelectedDates((prev) => {
      const found = prev.find((d) => d.isSame(date, "day"));
      let newDates;
      if (found) {
        // Remove date if already selected (toggle off)
        newDates = prev.filter((d) => !d.isSame(date, "day"));
      } else {
        // Add new selected date
        newDates = [...prev, date];
      }
      // Update form field value as array of strings
      form.setFieldsValue({
        unavailableDates: newDates.map((d) => d.format("YYYY-MM-DD")),
      });
      return newDates;
    });

    // Add this selection to existing ranges (allow multi select)
    // Check if range or single date
    let newEntry;
    if (date.length === 2) {
      newEntry = { start: date[0], end: date[1] };
    } else {
      newEntry = { start: date, end: null };
    }

    setUnavailableDatesRanges((prev) => [...prev, newEntry]);

    // Save flattened moments array in form for validation/submission if needed
    const allDates = [...unavailableDatesRanges, newEntry].flatMap(
      ({ start, end }) => {
        if (end) {
          const range = [];
          let day = moment(start);
          while (day.isSameOrBefore(end, "day")) {
            range.push(day.clone());
            day = day.add(1, "day");
          }
          return range;
        }
        return [start];
      }
    );

    form.setFieldsValue({ unavailableDates: allDates });
  };

  const removeDate = (dateToRemove) => {
    setSelectedDates((prev) => {
      const newDates = prev.filter((d) => !d.isSame(dateToRemove, "day"));
      form.setFieldsValue({
        unavailableDates: newDates.map((d) => d.format("YYYY-MM-DD")),
      });
      return newDates;
    });
  };

  // For "Any Other" prices dynamic inputs (field array)
  const [anyOtherPrices, setAnyOtherPrices] = useState([]);

  const addAnyOtherPrice = () => {
    setAnyOtherPrices((prev) => [
      ...prev,
      { name: "", price: undefined, id: Date.now() },
    ]);
  };

  const updateAnyOtherPrice = (id, key, value) => {
    setAnyOtherPrices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
  };

  const removeAnyOtherPrice = (id) => {
    setAnyOtherPrices((prev) => prev.filter((item) => item.id !== id));
  };

  const onFinish = async (values) => {
    console.log(values);

    // Validate image uploads
    if (!values.farmImages || !values.farmImages.length) {
      toast.error("Please upload at least one Farm/Resort image.");
      return;
    }
    if (!values.roomImages || !values.roomImages.length) {
      toast.error("Please upload at least one room image.");
      return;
    }

    // Prepare anyOtherPrices to simple array for submission
    const preparedAnyOtherPrices = anyOtherPrices.map(({ name, price }) => ({
      name,
      price,
    }));

    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (key === "farmImages") {
            formData.append(
              `hall_images[${index}]`,
              item?.originFileObj ?? item
            );
          } else if (key === "roomImages") {
            formData.append(
              `kitchen_images[${index}]`,
              item?.originFileObj ?? item
            );
          } else if (key === "brideImages") {
            formData.append(
              `bride_images[${index}]`,
              item?.originFileObj ?? item
            );
          } else if (key === "parkingImages") {
            formData.append(
              `parking_images[${index}]`,
              item?.originFileObj ?? item
            );
          }
        });
      } else if (
        key === "priceOptions" &&
        typeof value === "object" &&
        value !== null
      ) {
        Object.entries(value).forEach(([optionKey, optionValue]) => {
          if (optionValue !== undefined) {
            formData.append(optionKey, optionValue);
          }
        });
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    preparedAnyOtherPrices.forEach((item) => {
      if (item.name && item.price !== undefined) {
        formData.append(`other[${item.name}]`, item.price);
      }
    });

    formData.append("dates", JSON.stringify(values?.unavailableDates || []));

    formData.append("lat", "");
    formData.append("long", "");
    formData.append("type", "resort");

    // Debug: log all FormData values
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": ", pair[1]);
    }

    await addConvention(formData)
      .unwrap()
      .then((response) => {
        toast.success(
          response?.message || "Convention Resort/Farm created successfully"
        );
        console.log(response);
        form.resetFields();
        setfarmImages([]);
        setroomImages([]);
        setUnavailableDatesRanges([]);
        setAnyOtherPrices([]);

        onClose();
      })
      .catch((error) => {
        const errMsg =
          error?.data?.message ||
          error?.error ||
          "Failed to add Resort/Farm. Please try again.";
        toast.error(errMsg);
      });
  };

  return (
    <Modal
      title="Add New Resort/Farm Hall"
      open={showModal}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Upload Resort/Farm"
      okButtonProps={{
        style: {
          backgroundColor: "#7C0902",
          borderColor: "#7C0902",
          color: "white",
        },
        disabled: isLoading,
        loading: isLoading,
      }}
      cancelButtonProps={{
        style: { borderColor: "#7C0902", color: "#7C0902" },
      }}
      width="800px"
      style={{ maxHeight: "60vh", borderRadius: "8px" }}
    >
      <div className="px-4 ">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            acAvailable: "",
            royaltyDecoration: "",
            royaltyKitchen: "",
            generatorAvailable: "",
            normalWater: "",
            drinkingWater: "",
            cateringPersons: "",
            photographersRequired: "",
            parkingAvailable: "",
            alcohol_allowed: "",
            parking_guard: "",
            priceOptions: {},
          }}
          style={{ padding: "4px" }}
        >
          {/* Title */}
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter hall title" }]}
          >
            <Input placeholder="Enter hall title" />
          </Form.Item>

          {/* Description */}
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea rows={4} placeholder="Enter hall description" />
          </Form.Item>

          {/* Hall Images */}
          <Form.Item
            label="Farm/Resort Images (max 5)"
            name="farmImages"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Upload hall images" }]}
          >
            <Upload
              listType="picture-card"
              multiple
              beforeUpload={handleBeforeUpload}
              onChange={handleChangeFactory(setfarmImages)}
              fileList={farmImages}
              maxCount={maxImages}
              accept="image/*"
            >
              {farmImages.length >= maxImages ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          {/* Kitchen Images */}
          <Form.Item
            label="Kitchen Images (max 5)"
            name="roomImages"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Upload kitchen images" }]}
          >
            <Upload
              listType="picture-card"
              multiple
              beforeUpload={handleBeforeUpload}
              onChange={handleChangeFactory(setroomImages)}
              fileList={roomImages}
              maxCount={maxImages}
              accept="image/*"
            >
              {roomImages.length >= maxImages ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          {/* Room Capacity */}
          <Form.Item
            label="Rooms Available"
            name="seating_capacity"
            rules={[
              { required: true, message: "Please enter seating capacity" },
            ]}
          >
            <InputNumber
              min={50}
              max={2000}
              style={{ width: "100%" }}
              placeholder="Enter seating capacity (50-2000+)"
            />
          </Form.Item>

          {/* Price Options with individual inputs*/}
          <Form.Item label="Price Options" style={{ marginBottom: 0 }}>
            <Row gutter={16}>
              {priceOptions.map((opt) => (
                <Col key={opt.value} span={12} style={{ marginBottom: 12 }}>
                  <Form.Item
                    label={opt.label}
                    name={["priceOptions", opt.value]} // ✅ key goes here
                    rules={[{ type: "number", min: 0 }]}
                  >
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      placeholder={`Price for ${opt.label}`}
                      formatter={(value) => (value ? `₹ ${value}` : "")}
                      parser={(value) => value.replace(/\₹\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </Form.Item>

          {/* Any Other price entries with add/remove */}
          <Form.Item label="Any Other Price Options">
            {anyOtherPrices.map(({ id, name, price }, index) => (
              <Space
                key={id}
                style={{ display: "flex", marginBottom: 8 }}
                align="start"
              >
                <Input
                  placeholder="Name"
                  value={name}
                  onChange={(e) =>
                    updateAnyOtherPrice(id, "name", e.target.value)
                  }
                />
                <InputNumber
                  min={0}
                  placeholder="Price"
                  value={price}
                  formatter={(v) => (v ? `₹ ${v}` : "")}
                  parser={(v) => v.replace(/\₹\s?|(,*)/g, "")}
                  onChange={(value) => updateAnyOtherPrice(id, "price", value)}
                />
                <MinusCircleOutlined
                  onClick={() => removeAnyOtherPrice(id)}
                  style={{ fontSize: "20px", marginTop: 6, color: "red" }}
                />
              </Space>
            ))}
            <Button
              type="dashed"
              onClick={addAnyOtherPrice}
              block
              icon={<PlusOutlined />}
            >
              Add Other Price Option
            </Button>
          </Form.Item>

          {/* Parking & Alcohol */}
          {[
            { label: "Parking Available", name: "parking_available" },
            { label: "Children Games", name: "children_games" },
          ].map(({ label, name }) => (
            <Form.Item
              key={name}
              label={label}
              name={name}
              // rules={[
              //   {
              //     required: true,
              //     message: `Please select ${label.toLowerCase()}`,
              //   },
              // ]}
            >
              <Radio.Group options={yesNoOptions} />
            </Form.Item>
          ))}

          {/* Yes/No toggles for amenities */}
          {amenitiesOptions.map(({ label, name }) => (
            <Form.Item key={name} label={label} name={name}>
              <Radio.Group options={yesNoOptions} />
            </Form.Item>
          ))}

          {/* Multiple unavailable dates and ranges */}
          <label htmlFor="" className="py-2">
            Mark Unavailable Dates
          </label>
          <DatePicker
            disabledDate={disabledDate}
            onChange={onDateChange}
            style={{ width: "100%" }}
            placeholder="Select unavailable dates (one at a time)"
            allowClear
          />
          {selectedDates.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <b>Selected Unavailable Dates:</b>
              <ul>
                {selectedDates
                  .sort((a, b) => a.valueOf() - b.valueOf())
                  .map((date, i) => (
                    <li key={i} className="flex justify-between">
                      {date.format("YYYY-MM-DD")}{" "}
                      <Button
                        type="link"
                        danger
                        size="small"
                        onClick={() => removeDate(date)}
                        style={{ padding: 0 }}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          {/* Hidden Form.Item to hold actual value for form */}
          <Form.Item name="unavailableDates" hidden>
            <input />
          </Form.Item>
          <p className="mt-2">
            <span className="text-red-600">Note:</span> Please select only those
            dates on which your hall is NOT available for booking. All other
            dates will be considered available.
          </p>
        </Form>
      </div>
    </Modal>
  );
};

export default AddFarmHouse;
