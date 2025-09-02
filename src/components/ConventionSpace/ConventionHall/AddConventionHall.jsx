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

const standardPriceOptions = [
  "Wedding",
  "Wedding Anniversary",
  "Wedding Reception",
  "Pre Wedding Mehendi Party",
  "Birthday Party",
  "Ring Ceremony",
  "Engagement",
  "Family Function",
  "First Birthday Party",
  "Naming Ceremony",
  "Sangeet Ceremony",
  "Baby Shower",
  "Birda Shower",
  "Kids Birthday Party",
  "Dhoti Event",
  "Upanayam",
  "Corparate Event",
  "Corporate Party",
  "Farewell",
  "Stage Event",
  "Children Party",
  "Annual Fest",
  "Family Get Together",
  "New Year Party",
  "Freshers Party",
  "Brand Promotion",
  "Get Together",
  "Meeting",
  "Diwali Party",
  "Conference",
  "Kitty Party",
  "Bachelor Party",
  "Chritmas Party",
  "Product Launch",
  "Corprate Offsite",
  "Lohri Party",
  "Class Reunion",
  "Valentine's Day",
  "Dealers Meet",
  "MICE",
  "House Party",
  "Group Dining",
  "Adventure Party",
  "Residential Conference",
  "Corporate Traning",
  "Business Dinner",
  "Musical Concert",
  "Exhibition",
  "Cocktail Dinner",
  "Holi Party",
  "Team Outing",
  "Social Mixer",
  "Photo Shoots",
  "Fashion Show",
  "Team Building",
  "Traning",
  "Aqueeqa Ceremony",
  "Video Shoots",
  "Walkin Interview",
  "Game Watch",
  "Pool Party",
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

const AddConventionHall = ({ showModal, onClose }) => {
  const [form] = Form.useForm();
  const [addConvention, { error, isLoading }] = useAddConventionMutation();

  const [hallImages, setHallImages] = useState([]);
  const [kitchenImages, setKitchenImages] = useState([]);
  const [parkingImages, setParkingImages] = useState([]);
  const [brideImages, setBrideImages] = useState([]);
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
    if (dates.length === 2) {
      newEntry = { start: dates[0], end: dates[1] };
    } else {
      newEntry = { start: dates, end: null };
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
    if (!values.hallImages || !values.hallImages.length) {
      toast.error("Please upload at least one hall image.");
      return;
    }
    if (!values.kitchenImages || !values.kitchenImages.length) {
      toast.error("Please upload at least one kitchen image.");
      return;
    }
    if (!values.parkingImages || !values.parkingImages.length) {
      toast.error("Please upload at least one parking image.");
      return;
    }

    if (!values.brideImages || !values.brideImages.length) {
      toast.error("Please upload at least one Bride/Groom Room image.");
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
          if (key === "hallImages") {
            formData.append(
              `hall_images[${index}]`,
              item?.originFileObj ?? item
            );
          } else if (key === "kitchenImages") {
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

    // Debug: log all FormData values
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": ", pair[1]);
    }

    await addConvention(formData)
      .unwrap()
      .then((response) => {
        toast.success(
          response?.message || "Convention hall created successfully"
        );
        console.log(response);
      })
      .catch((error) => {
        const errMsg =
          error?.data?.message ||
          error?.error ||
          "Failed to add Hall. Please try again.";
        toast.error(errMsg);
      });

    form.resetFields();
    setHallImages([]);
    setKitchenImages([]);
    setParkingImages([]);
    setAnyOtherPrices([]);
    setUnavailableDatesRanges([]);
    onClose();
  };

  return (
    <Modal
      title="Add New Convention Hall"
      open={showModal}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Upload Hall"
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
            label="Hall Title"
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
            label="Hall Images (max 5)"
            name="hallImages"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Upload hall images" }]}
          >
            <Upload
              listType="picture-card"
              multiple
              beforeUpload={handleBeforeUpload}
              onChange={handleChangeFactory(setHallImages)}
              fileList={hallImages}
              maxCount={maxImages}
              accept="image/*"
            >
              {hallImages.length >= maxImages ? null : (
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
            name="kitchenImages"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Upload kitchen images" }]}
          >
            <Upload
              listType="picture-card"
              multiple
              beforeUpload={handleBeforeUpload}
              onChange={handleChangeFactory(setKitchenImages)}
              fileList={kitchenImages}
              maxCount={maxImages}
              accept="image/*"
            >
              {kitchenImages.length >= maxImages ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          {/* Bride/Groom Room Images */}
          <Form.Item
            label="Bride/Groom Room Images (max 5)"
            name="brideImages"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Upload kitchen images" }]}
          >
            <Upload
              listType="picture-card"
              multiple
              beforeUpload={handleBeforeUpload}
              onChange={handleChangeFactory(setBrideImages)}
              fileList={brideImages}
              maxCount={maxImages}
              accept="image/*"
            >
              {brideImages.length >= maxImages ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          {/* Parking Images */}
          <Form.Item
            label="Parking Images (max 5)"
            name="parkingImages"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Upload parking images" }]}
          >
            <Upload
              listType="picture-card"
              multiple
              beforeUpload={handleBeforeUpload}
              onChange={handleChangeFactory(setParkingImages)}
              fileList={parkingImages}
              maxCount={maxImages}
              accept="image/*"
            >
              {parkingImages.length >= maxImages ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          {/* Seating Capacity */}
          <Form.Item
            label="Seating Capacity"
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

          {/* Contact Details */}
          <Form.Item
            label="Contact Details"
            name="contactDetails"
            rules={[
              { required: true, message: "Please enter contact details" },
            ]}
          >
            <TextArea rows={2} placeholder="Enter contact details" />
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

          {/* Hall Decorator Name */}
          <Form.Item label="Hall Decorator Name" name="hall_decorator_name">
            <Input placeholder="Enter Hall Decorator Name" />
          </Form.Item>

          {/* Hall Decorator Name */}
          <Form.Item label="Hall Decorator Number" name="hall_decorator_number">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter Hall Decorator Number"
            />
          </Form.Item>
          {/* Parking & Alcohol */}
          {[
            { label: "Parking Guard", name: "parking_guard" },
            { label: "Alcohol Allowed", name: "alcohol_allowed" },
          ].map(({ label, name }) => (
            <Form.Item
              key={name}
              label={label}
              name={name}
              rules={[
                {
                  required: true,
                  message: `Please select ${label.toLowerCase()}`,
                },
              ]}
            >
              <Radio.Group options={yesNoOptions} />
            </Form.Item>
          ))}

          {/* Yes/No toggles for amenities */}
          {[
            { label: "A/C Available", name: "ac_available" },
            { label: "Royalty for Decoration", name: "royalty_decoration" },
            { label: "Royalty for Kitchen", name: "royalty_kitchen" },
            { label: "Generator Available", name: "generator_available" },
            { label: "Water for Cooking", name: "water_for_cooking" },
            {
              label: "Drinking Water Available",
              name: "drinking_water_available",
            },
            {
              label: "Provides Catering Persons",
              name: "provieds_catering_persons",
            },
            { label: "Photographers Required", name: "photographers_required" },
            { label: "Parking Available", name: "parking_available" },
          ].map(({ label, name }) => (
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

export default AddConventionHall;
