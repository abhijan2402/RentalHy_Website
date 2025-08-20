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
  "Day Visit",
  "For Occasion",
  "Each Extra Room charges",
];

const yesNoOptions = ["Yes", "No"];

const AddFarmHouse = ({ showModal, onClose }) => {
  const [form] = Form.useForm();

  const [hallImages, setHallImages] = useState([]);
  const [kitchenImages, setKitchenImages] = useState([]);
  const [parkingImages, setParkingImages] = useState([]);
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

  const onFinish = (values) => {
    // Validate image uploads
    if (!values.hallImages || !values.hallImages.length) {
      message.error("Please upload at least one hall image.");
      return;
    }
    if (!values.kitchenImages || !values.kitchenImages.length) {
      message.error("Please upload at least one kitchen image.");
      return;
    }
    if (!values.parkingImages || !values.parkingImages.length) {
      message.error("Please upload at least one parking image.");
      return;
    }

    // Validate price entries
    const missingPriceTypes = standardPriceOptions.filter(
      (opt) =>
        values.priceOptions?.[opt] === undefined ||
        values.priceOptions[opt] === null
    );
    if (missingPriceTypes.length > 0) {
      message.error(
        `Please enter price for options: ${missingPriceTypes.join(", ")}`
      );
      return;
    }
    for (const aop of anyOtherPrices) {
      if (!aop.name || aop.price === undefined || aop.price === null) {
        message.error(
          "Please enter name and price for all 'Any Other' entries"
        );
        return;
      }
    }

    // Prepare anyOtherPrices to simple array for submission
    const preparedAnyOtherPrices = anyOtherPrices.map(({ name, price }) => ({
      name,
      price,
    }));

    const prepareImagesInfo = (files) =>
      files.map((file) => ({
        name: file.name,
        uid: file.uid,
      }));

    // Merge priceOptions and anyOtherPrices
    const allPriceOptions = {
      ...values.priceOptions,
      anyOtherPrices: preparedAnyOtherPrices,
    };

    const submissionData = {
      ...values,
      priceOptions: allPriceOptions,
      hallImages: prepareImagesInfo(values.hallImages),
      kitchenImages: prepareImagesInfo(values.kitchenImages),
      parkingImages: prepareImagesInfo(values.parkingImages),
      unavailableDates: unavailableDatesRanges.map(({ start, end }) => ({
        start: start.format("YYYY-MM-DD"),
        end: end ? end.format("YYYY-MM-DD") : null,
      })),
    };

    console.log("Submitted data:", submissionData);

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
      title="Add New Farm House"
      open={showModal}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Upload Hall"
      okButtonProps={{
        style: { backgroundColor: "#7C0902", borderColor: "#7C0902" },
      }}
      cancelButtonProps={{
        style: { borderColor: "#7C0902", color: "#7C0902" },
      }}
      width="800px"
      bodyStyle={{ maxHeight: "60vh", overflowY: "auto" }}
    >
      <div className="px-4">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            acAvailable: "No",
            royaltyDecoration: "No",
            royaltyKitchen: "No",
            generatorAvailable: "No",
            normalWater: "No",
            drinkingWater: "No",
            cateringPersons: "No",
            photographersRequired: "No",
            parkingAvailable: "No",
            priceOptions: {},
          }}
          style={{ padding: "4px" }}
        >
          {/* Title */}
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter title" }]}
          >
            <Input placeholder="Enter title" />
          </Form.Item>

          {/* Description */}
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea rows={4} placeholder="Enter farm description" />
          </Form.Item>

          {/* Farm Images */}
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

          {/* Price Options with individual inputs*/}
          <Form.Item label="Price Options" style={{ marginBottom: 0 }}>
            <Row gutter={16}>
              {standardPriceOptions.map((opt) => (
                <Col key={opt} span={12} style={{ marginBottom: 12 }}>
                  <Form.Item
                    name={["priceOptions", opt]}
                    label={opt}
                    rules={[{ required: true, message: "Please enter price" }]}
                    noStyle
                  >
                    <label htmlFor="">{opt}</label>
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      placeholder={`Price for ${opt}`}
                      formatter={(value) => (value ? `₹ ${value}` : "")}
                      parser={(value) => value.replace(/\₹\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </Form.Item>

          {/* Rooms Capacity */}
          <Form.Item
            label="Rooms Available"
            name="roomsCapacity"
            rules={[{ required: true, message: "Please enter rooms capacity" }]}
          >
            <InputNumber
              min={50}
              max={2000}
              style={{ width: "100%" }}
              placeholder="Enter rooms svailable (50-2000+)"
            />
          </Form.Item>

          {/* Yes/No toggles for amenities */}
          {[
            { label: "Swimming Pool", name: "swimmingpool" },
            { label: "Food Available", name: "foodavailable" },
            { label: "Outside Food Allowed", name: "outsidefood" },
            { label: "CCTV Avaiable", name: "cctvavaiable" },
            { label: "Sound System Available", name: "soundsystemavaiable" },
            { label: "Sound System Allowed", name: "soundsystemallowed" },
            { label: "Children Games", name: "childrengames" },
            { label: "Adult Games", name: "adultgames" },
            { label: "Kitchen Setup with all Materials", name: "kitchensetup" },
          ].map(({ label, name }) => (
            <Form.Item
              key={name}
              label={label}
              name={name}
              rules={[
                {
                  message: `Please select ${label.toLowerCase()}`,
                },
              ]}
            >
              <Radio.Group options={yesNoOptions} />
            </Form.Item>
          ))}

          {/* Area */}
          <Form.Item label="Area (in sq. fts)" name="area">
            <Input placeholder="Enter Area(in sq.fts)" />
          </Form.Item>

          {/* Yes/No toggles for amenities */}
          {[{ label: "Parking Available", name: "parkingAvailable" }].map(
            ({ label, name }) => (
              <Form.Item
                key={name}
                label={label}
                name={name}
                rules={[
                  {
                    message: `Please select ${label.toLowerCase()}`,
                  },
                ]}
              >
                <Radio.Group options={yesNoOptions} />
              </Form.Item>
            )
          )}

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
            dates on whixh your hall is NOT available for booking. All other
            dates will be considered available.
          </p>
        </Form>
      </div>
    </Modal>
  );
};

export default AddFarmHouse;
