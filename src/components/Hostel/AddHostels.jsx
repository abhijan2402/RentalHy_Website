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
  Checkbox,
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

// Rules & Policies
const rulesPoliciesOptions = [
  { label: "Gate closing time (curfew)", value: "curfew" },
  { label: "Visitors allowed", value: "visitorsAllowed" },
  { label: "Visitors NOT allowed", value: "visitorsNotAllowed" },
  { label: "Smoking/Alcohol Policy", value: "smokingAlcoholPolicy" },
  { label: "Pets allowed", value: "petsAllowed" },
  { label: "Refund policy for deposit", value: "refundPolicy" },
];

// Bathroom Type
const bathroomTypeOptions = [
  { label: "Attached", value: "attached" },
  { label: "Common", value: "common" },
  { label: "Both", value: "both" },
];

// Hostel Type
const hostelTypeOptions = [
  { label: "Male hostel", value: "maleHostel" },
  { label: "Female hostel", value: "femaleHostel" },
  { label: "Co-living hostel", value: "coLivingHostel" },
];

// Furnishing Status & Features
const furnishingOptions = [
  { label: "Bed with mattress and pillow", value: "bedComplete" },
  { label: "Bed frame only", value: "bedFrameOnly" },
  { label: "Study table & chair", value: "studyTableChair" },
  { label: "Wardrobe/Cupboard", value: "wardrobeCupboard" },
  { label: "Fan", value: "fan" },
  { label: "Lights", value: "lights" },
  { label: "Curtains", value: "curtains" },
  { label: "AC", value: "ac" },
  { label: "Geyser (Hot water)", value: "geyserHotWater" },
  { label: "Basic appliances", value: "basicAppliances" },
  { label: "Limited storage space", value: "limitedStorage" },
  { label: "Only room (no furniture/appliance)", value: "onlyRoom" },
  { label: "Tenant brings own setup", value: "tenantOwnSetup" },
];

const standardPriceOptions = [
  "Single room (Day/Month)",
  "Double sharing/month",
  "Triple sharing/month",
  "4 sharing/month",
  "Security Deposit",
];
const standardPriceDormitoyOptions = [
  "1 Day Stay",
  "1 Week Stay",
  "1 Month Stay",
];

const yesNoOptions = ["Yes", "No"];

function cleanObject(obj) {
  if (Array.isArray(obj)) {
    return obj
      .map(cleanObject)
      .filter(
        (v) =>
          v !== undefined &&
          v !== null &&
          !(typeof v === "object" && Object.keys(v).length === 0)
      );
  } else if (obj !== null && typeof obj === "object") {
    const cleaned = {};
    Object.keys(obj).forEach((key) => {
      const value = cleanObject(obj[key]);
      if (
        value !== undefined &&
        value !== null &&
        !(typeof value === "string" && value.trim() === "") &&
        !(Array.isArray(value) && value.length === 0) &&
        !(
          typeof value === "object" &&
          !Array.isArray(value) &&
          Object.keys(value).length === 0
        )
      ) {
        cleaned[key] = value;
      }
    });
    return cleaned;
  }
  return obj;
}

const AddHostels = ({ showModal, onClose }) => {
  const [form] = Form.useForm();

  const [hostelImgae, setHostelImgae] = useState([]);
  const [MenuImages, setMenuImages] = useState([]);

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

  const onFinish = (values) => {
    // Validate mandatory uploads
    if (!values.hostelImages || values.hostelImages.length === 0) {
      message.error("Please upload at least one hall image.");
      return;
    }

    // Prepare images info safely or empty array if missing
    const prepareImagesInfo = (files = []) =>
      files.map((file) => ({ name: file.name, uid: file.uid }));

    // Compose raw payload
    const rawPayload = {
      ...values,
      hostelImages: prepareImagesInfo(values.hostelImages),
      menuImages: prepareImagesInfo(values.menuImages),
    };

    // Clean recursively all undefined, null, empty strings, empty arrays, empty objects
    const cleanedPayload = cleanObject(rawPayload);

    console.log("Cleaned payload:", cleanedPayload);

    // Continue with API submission etc...
    form.resetFields();
    setHostelImgae([]);
    setMenuImages([]);
    onClose();
  };

  return (
    <Modal
      title="Add New Hostel"
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
    >
      <div className="px-4">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            priceOptions: {},
          }}
          style={{ padding: "4px" }}
        >
          {/* Hostel Images */}
          <Form.Item
            label="Hostel Images (max 5)"
            name="hostelImages" // changed from hostelImgae
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Upload hostel images" }]}
          >
            <Upload
              listType="picture-card"
              multiple
              beforeUpload={handleBeforeUpload}
              onChange={handleChangeFactory(setHostelImgae)}
              fileList={hostelImgae}
              maxCount={maxImages}
              accept="image/*"
            >
              {hostelImgae.length >= maxImages ? null : (
                <div>
                  <PlusOutlined /> <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          {/* Title */}
          <Form.Item
            label="Hostel Title"
            name="title"
            rules={[{ required: true, message: "Please enter hostel title" }]}
          >
            <Input placeholder="Enter hostel title" />
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
          {/* Alternate Contact Details */}
          <Form.Item
            label="Alternate Contact Details"
            name="alternateContactDetails"
          >
            <TextArea rows={2} placeholder="Enter alternate contact details" />
          </Form.Item>
          {/* Description */}
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea rows={4} placeholder="Enter hall description" />
          </Form.Item>
          <p className="font-bold text-[#7C0902]">Room Price</p>
          {/* Price Options with individual inputs*/}
          <Form.Item style={{ marginBottom: 0 }}>
            <Row gutter={16}>
              {standardPriceOptions.map((opt) => (
                <Col key={opt} span={12} style={{ marginBottom: 12 }}>
                  <Form.Item name={["priceOptions", opt]} label={opt} noStyle>
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
          <p className="font-bold text-[#7C0902]">Dormitory Price</p>
          {/*Dormitory Price Options with individual inputs*/}
          <Form.Item style={{ marginBottom: 0, color: "" }}>
            <Row gutter={16}>
              {standardPriceDormitoyOptions.map((opt) => (
                <Col key={opt} span={12} style={{ marginBottom: 12 }}>
                  <Form.Item name={["priceOptions", opt]} label={opt} noStyle>
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
          {/* Security Deposit */}
          <Form.Item label="Security Deposit" name="securityDeposit">
            <InputNumber
              min={0}
              max={15000}
              style={{ width: "100%" }}
              placeholder="Enter Security Deposit"
            />
          </Form.Item>
          {/* Map Link  */}
          <Form.Item label="Map Link" name="maplink">
            <Input
              style={{ width: "100%" }}
              placeholder="Enter Security Deposit"
            />
          </Form.Item>
          {/* Location  */}
          <Form.Item label="Location" name="location">
            <Input style={{ width: "100%" }} placeholder="Enter Location" />
          </Form.Item>
          {/* Landmark  */}
          <Form.Item label="Land Mark" name="landmark">
            <Input style={{ width: "100%" }} placeholder="Enter Landmark" />
          </Form.Item>
          {/* Room Size (sq.ft) */}
          <Form.Item label="Room Size (sq.ft)">
            <Input.Group compact>
              <Form.Item name={["roomSize", "min"]} noStyle>
                <Input style={{ width: 150 }} placeholder="Min" type="number" />
              </Form.Item>
              {/* <span style={{ margin: "0 8px" }}>to</span> */}
              <Form.Item name={["roomSize", "max"]} noStyle>
                <Input style={{ width: 150 }} placeholder="Max" type="number" />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          {/* Hostel Types */}
          <Form.Item label="Hostel Type" name="hostelType">
            <Checkbox.Group options={hostelTypeOptions} />
          </Form.Item>
          {/* Furnishing Status */}
          <Form.Item
            label="Furnishing Status & Features"
            name="furnishingFeatures"
          >
            <Checkbox.Group options={furnishingOptions} />
          </Form.Item>
          {/* Bathrooms */}
          <Form.Item label="Bathroom Type" name="bathroomType">
            <Checkbox.Group options={bathroomTypeOptions} />
          </Form.Item>
          {/* Yes/No toggles for amenities */}
          {[
            { label: "Menu", name: "Menu" },
            { label: "Wifi", name: "wifi" },
            { label: "Ac/Non-AC", name: "ac/non-ac" },
            { label: "Laundry Service", name: "laundryService" },
            { label: "Housekeeping", name: "housekeeping" },
            { label: "Hot Water / Geyser", name: "hotWaterGeyser" },
            { label: "Power Backup", name: "powerBackup" },
            { label: "Parking Available", name: "parkingAvailable" },
            { label: "Parking (2W/4W)", name: "parking2W4W" },
            { label: "Gym", name: "gym" },
            { label: "Play Area", name: "playArea" },
            { label: "TV", name: "tv" },
            { label: "Dining Table", name: "diningTable" },
            { label: "Security", name: "security" },
            { label: "RO Drinking Water", name: "roDrinkingWater" },
            { label: "Study Area", name: "studyArea" },
            { label: "Normal Water for Cooking", name: "normalWater" },
            { label: "Drinking Water Available", name: "drinkingWater" },
            { label: "Provides Catering Persons", name: "cateringPersons" },
            { label: "Photographers Required", name: "photographersRequired" },
          ].map(({ label, name }) => (
            <Form.Item key={name} label={label} name={name}>
              <Radio.Group options={yesNoOptions} />
            </Form.Item>
          ))}
          {/* Food Options */}
          <p className="font-bold text-[#7C0902]">Food Options</p>
          {[
            { label: "Mess", name: "mess" },
            { label: "Breakfast", name: "breakfast" },
            { label: "Lunch", name: "lunch" },
            { label: "Dinner", name: "dinner" },
            { label: "Tea/Coffee", name: "teaCoffee" },
            { label: "Snacks", name: "snacks" },
          ].map(({ label, name }) => (
            <Form.Item key={name} label={label} name={name}>
              <Radio.Group options={yesNoOptions} />
            </Form.Item>
          ))}
          {/* Timing */}
          {/* Breakfast  */}
          <Form.Item label="Breakfast Timing" name="breakfastTiming">
            <Input
              style={{ width: "100%" }}
              placeholder="Enter Breakfast Timing"
            />
          </Form.Item>
          {/* Tea/Coffee Timing */}
          <Form.Item label="Tea/Coffee Timing" name="teaCoffeeTiming">
            <Input
              style={{ width: "100%" }}
              placeholder="Enter Tea/Coffee Timing"
            />
          </Form.Item>
          {/* Lunch Timing */}
          <Form.Item label="Lunch Timing" name="lunchTiming">
            <Input style={{ width: "100%" }} placeholder="Enter Lunch Timing" />
          </Form.Item>
          {/* Snacks Timing */}
          <Form.Item label="Snacks Timing" name="snacksTiming">
            <Input
              style={{ width: "100%" }}
              placeholder="Enter Snacks Timing"
            />
          </Form.Item>
          {/* Dinner Timing */}
          <Form.Item label="Dinner Timing" name="dinnerTiming">
            <Input
              style={{ width: "100%" }}
              placeholder="Enter Dinner Timing"
            />
          </Form.Item>
          {/* Document Required */}
          <Form.Item label="Document Required" name="documentRequired">
            <Input
              style={{ width: "100%" }}
              placeholder="Enter Document Required"
            />
          </Form.Item>
          {/* Rules AND Policies */}
          <Form.Item label="Rules & Policies" name="rulesPolicies">
            <Checkbox.Group options={rulesPoliciesOptions} />
          </Form.Item>
          {/* Menue Images */}
          <Form.Item
            label="Menu Images (max 5)"
            name="menuImages"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              listType="picture-card"
              multiple
              beforeUpload={handleBeforeUpload}
              onChange={handleChangeFactory(setMenuImages)}
              fileList={MenuImages}
              maxCount={maxImages}
              accept="image/*"
            >
              {MenuImages.length >= maxImages ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default AddHostels;
