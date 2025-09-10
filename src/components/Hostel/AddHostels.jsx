import React, { useEffect, useRef, useState } from "react";
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
  TimePicker,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { useAddHostelMutation } from "../../redux/api/hostelApi";
import { toast } from "react-toastify";
import {
  GoogleMap,
  MarkerF,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useLocationCoord } from "../../contexts/LocationContext";
import { getLatLngFromAddress } from "../../utils/utils";
import dayjs from "dayjs";
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
};

const normFile = (e) => {
  if (Array.isArray(e)) return e;
  return e?.fileList?.map((file) => file.originFileObj) || [];
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
  { label: "Male hostel", value: "male" },
  { label: "Female hostel", value: "female" },
  { label: "Co-living hostel", value: "co-living" },
];

// Furnishing Status & Features
const furnishingOptions = [
  { label: "Bed with mattress and pillow", value: "Complete Bed" },
  { label: "Bed frame only", value: "Bed Frame only" },
  { label: "Study table & chair", value: "Study Table, Chair" },
  { label: "Wardrobe/Cupboard", value: "Wardrobe, Cupboard" },
  { label: "Fan", value: "fan" },
  { label: "Lights", value: "lights" },
  { label: "Curtains", value: "curtains" },
  { label: "A/C", value: "ac" },
  { label: "Geyser (Hot water)", value: "geyser HotWater" },
  { label: "Basic appliances", value: "basic Appliances" },
  { label: "Limited storage space", value: "limited Storage" },
  { label: "Only room (no furniture/appliance)", value: "only Room" },
  { label: "Tenant brings own setup", value: "tenant Own Setup" },
];

const standardPriceOptions = [
  { label: "Double sharing/month", value: "double_sharing_price" },
  { label: "Triple sharing/month", value: "triple_sharing_price" },
  { label: "4 sharing/month", value: "four_sharing_price" },
  { label: "Security Deposit", value: "security_deposit" },
  { label: "Single room (Day)", value: "single_room_price_day" },
  { label: "Single room (Month)", value: "single_room_price_month" },
];

const standardPriceDormitoyOptions = [
  { label: "1 Day Stay", value: "one_day_stay" },
  { label: "1 Week Stay", value: "one_week_stay" },
  { label: "1 month Stay", value: "one_month_stay" },
];

const yesNoOptions = [
  { label: "Yes", value: "1" },
  { label: "No", value: "0" },
];

const TIME_FIELDS = [
  "breakfast_timing",
  "tea_toffee_timing",
  "snacks_timing",
  "lunch_timing",
  "dinner_timing",
  "gate_closing_timing",
  "gate_opening_timing",
  // add all other time fields here
];

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
  const { latitude, longitude, city, area } = useLocationCoord();
  const [defaultCenter, setDefaultCenter] = useState({
    lat: latitude || 20.5937,
    lng: longitude || 78.9629,
  });

  useEffect(() => {
    if (latitude != null && longitude != null) {
      setDefaultCenter({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude]);

  const [form] = Form.useForm();
  const [addHostel, { error, isLoading }] = useAddHostelMutation();
  const [hostelImgae, setHostelImgae] = useState([]);
  const [MenuImages, setMenuImages] = useState([]);
  const [markerPos, setMarkerPos] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [searchText, setSearchText] = useState("");

  const autocompleteRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script", // ✅ use same id everywhere
    googleMapsApiKey: import.meta.env.VITE_MAP_KEY,
    libraries: ["places"],
  });

  // Sync searchText when form.location changes
  useEffect(() => {
    setSearchText(form.getFieldValue("location") || "");
  }, [form]);

  // Detect user location on load
  useEffect(() => {
    if (isLoaded && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMarkerPos(pos);
          setMapCenter(pos);
          // form.setFieldsValue({ lat: pos.lat, long: pos.lng });

          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: pos }, (results, status) => {
            if (status === "OK" && results[0]) {
              form.setFieldsValue({ location: results[0].formatted_address });
              setSearchText(results[0].formatted_address);
            }
          });
        },
        (err) => console.warn("Geolocation denied/unavailable:", err.message)
      );
    }
  }, [isLoaded]);

  // ✅ Autocomplete select
  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      const pos = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setMarkerPos(pos);
      setMapCenter(pos);
      const address = place.formatted_address || place.name;
      const mapsUrl = `https://www.google.com/maps?q=${pos.lat},${pos.lng}`;
      form.setFieldsValue({
        location: address,
        map_link: mapsUrl,
        // lat: pos.lat,
        // long: pos.lng,
      });
      setSearchText(address);
    }
  };

  // ✅ Map click
  const handleMapClick = (e) => {
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarkerPos(pos);
    setMapCenter(pos);

    const mapsUrl = `https://www.google.com/maps?q=${pos.lat},${pos.lng}`;

    console.log(mapsUrl);

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: pos }, (results, status) => {
      if (status === "OK" && results[0]) {
        const address = results[0].formatted_address;
        form.setFieldsValue({
          location: address,
          map_link: mapsUrl,
          // lat: pos.lat,
          // long: pos.lng,
        });
        setSearchText(address);
      } else {
        form.setFieldsValue({
          map_link: mapsUrl,
        });
      }
    });
  };

  // ✅ Marker drag
  const handleMarkerDragEnd = (e) => {
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarkerPos(pos);
    setMapCenter(pos);
    const mapsUrl = `https://www.google.com/maps?q=${pos.lat},${pos.lng}`;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: pos }, (results, status) => {
      if (status === "OK" && results[0]) {
        const address = results[0].formatted_address;
        form.setFieldsValue({
          location: address,
          map_link: mapsUrl,
          // lat: pos.lat,
          // long: pos.lng,
        });
        setSearchText(address);
      } else {
        form.setFieldsValue({
          map_link: mapsUrl,
        });
      }
    });
  };

  const handleBeforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleChangeFactory = (setFn) => (fileList) => {
    setFn(fileList.slice(0, maxImages));
  };

  const onFinish = async (values) => {
    // Validate mandatory uploads
    let coords = null;
    if (values.location) {
      coords = await getLatLngFromAddress(values.location);
    }
    console.log(coords, values?.map_link);
    if (!values.images || values.images.length === 0) {
      message.error("Please upload at least one hall image.");
      return;
    }
    // ✅ Handle custom floor (replace floor=other with custom_floor)
    if (values.floor === "other" && values.custom_floor) {
      values.floor = values.custom_floor; // replace with actual input
    }
    delete values.custom_floor;

    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (TIME_FIELDS.includes(key) && value) {
        value = value.format("HH:mm");
      }

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          // ✅ hostel_type & bathroom_type → plain values
          if (key === "hostel_type" || key === "bathroom_type") {
            formData.append(key, item);
          }
          // ✅ images → raw file with indexed keys like images[0], images[1]
          else if (key === "images") {
            formData.append(`images[${index}]`, item?.originFileObj ?? item);
          }
          // ✅ menu_images → raw file with indexed keys
          else if (key === "menu_images") {
            formData.append(
              `menu_images[${index}]`,
              item?.originFileObj ?? item
            );
          }
          // ✅ other array fields → indexed keys
          else {
            formData.append(`${key}[${index}]`, item);
          }
        });
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    if (coords) {
      formData.append("lat", coords.lat.toString());
      formData.append("long", coords.lng.toString());
    }

    // Debug: log all FormData values
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": ", pair[1]);
    }

    await addHostel(formData)
      .unwrap()
      .then((response) => {
        toast.success("Hostel added successfully!");
        console.log(response);
      })
      .catch((error) => {
        const errMsg =
          error?.data?.message ||
          error?.error ||
          "Failed to add hostel. Please try again.";
        toast.error(errMsg);
      });

    // Reset logic if needed
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
        disabled: isLoading,
        loading: isLoading,
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
            mess: "",
            breakfast: "",
            lunch: "",
            dinner: "",
            tea_coffee: "",
            snacks: "",
            wifi: "",
            ac: "",
            laundry_service: "",
            housekeeping: "",
            hot_water: "",
            power_backup: "",
            parking: "",
            gym: "",
            play_area: "",
            tv: "",
            dining_table: "",
            security: "",
            ro_water: "",
            study_area: "",
          }}
          style={{ padding: "4px" }}
        >
          {/* Hostel Images */}
          <Form.Item
            label="Hostel Images (max 5)"
            name="images" // changed from hostelImgae
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
            name="contact_number"
            rules={[
              { required: true, message: "Please enter contact details" },
            ]}
          >
            <TextArea rows={2} placeholder="Enter contact details" />
          </Form.Item>
          {/* Alternate Contact Details */}
          <Form.Item
            label="Alternate Contact Details"
            name="alternate_contact_number"
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
          {/* Which Floor */}
          <Form.Item
            label="Which Floor"
            name="floor"
            rules={[{ required: true, message: "Please select floor" }]}
          >
            <Radio.Group>
              <Radio value="0">Ground (0)</Radio>
              <Radio value="1">1</Radio>
              <Radio value="2">2</Radio>
              <Radio value="3">3</Radio>
              <Radio value="4">4</Radio>
              <Radio value="5">5</Radio>
              <Radio value="6">6+</Radio>
              <Radio value="other">Other</Radio>
            </Radio.Group>
          </Form.Item>

          {/* Custom floor if "Other" is selected */}
          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.floor !== curr.floor}
          >
            {({ getFieldValue }) =>
              getFieldValue("floor") === "other" ? (
                <Form.Item
                  label="Enter Floor Number"
                  name="custom_floor"
                  rules={[
                    { required: true, message: "Please enter floor number" },
                    { pattern: /^[0-9]+$/, message: "Only numbers allowed" },
                  ]}
                >
                  <Input placeholder="Enter floor number (e.g., 7, 12, 20)" />
                </Form.Item>
              ) : null
            }
          </Form.Item>
          <p className="font-bold text-[#7C0902]">Room Price</p>
          {/* Price Options with individual inputs*/}
          <Form.Item style={{ marginBottom: 0 }}>
            <Row gutter={16}>
              {standardPriceOptions.map(({ label, value }) => (
                <Col key={value} span={12} style={{ marginBottom: 12 }}>
                  <label className="block mb-1 font-medium">{label}</label>
                  <Form.Item name={value} noStyle>
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      placeholder={`Price for ${label}`}
                      formatter={(v) => (v ? `₹ ${v}` : "")}
                      parser={(v) => v.replace(/\₹\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </Form.Item>

          <p className="font-bold text-[#7C0902]">Dormitory Price</p>
          {/*Dormitory Price Options with individual inputs*/}
          <Form.Item style={{ marginBottom: 0 }}>
            <Row gutter={16}>
              <Col span={12} style={{ marginBottom: 12 }}>
                <label className="block mb-1 font-medium">1 Day Stay</label>
                <Form.Item name={["one_day_stay"]} noStyle>
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    placeholder="Price for 1 Day Stay"
                    formatter={(value) => (value ? `₹ ${value}` : "")}
                    parser={(value) => value.replace(/\₹\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Col>

              <Col span={12} style={{ marginBottom: 12 }}>
                <label className="block mb-1 font-medium">1 Week Stay</label>
                <Form.Item name={["one_week_stay"]} noStyle>
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    placeholder="Price for 1 Week Stay"
                    formatter={(value) => (value ? `₹ ${value}` : "")}
                    parser={(value) => value.replace(/\₹\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Col>

              <Col span={12} style={{ marginBottom: 12 }}>
                <label className="block mb-1 font-medium">1 Month Stay</label>
                <Form.Item name={["one_month_stay"]} noStyle>
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    placeholder="Price for 1 Month Stay"
                    formatter={(value) => (value ? `₹ ${value}` : "")}
                    parser={(value) => value.replace(/\₹\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          {/* Location Picker */}
          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: "Please select location" }]}
          >
            {isLoaded ? (
              <Autocomplete
                onLoad={(ac) => (autocompleteRef.current = ac)}
                onPlaceChanged={handlePlaceChanged}
              >
                <Input
                  placeholder="Search location"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    form.setFieldsValue({
                      location: e.target.value,
                      lat: null,
                      long: null,
                    });
                  }}
                  allowClear
                />
              </Autocomplete>
            ) : (
              <Input placeholder="Loading Google Maps..." disabled />
            )}
          </Form.Item>

          {/* Map */}
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={15}
              onClick={handleMapClick}
            >
              {markerPos && (
                <MarkerF
                  position={markerPos}
                  draggable
                  onDragEnd={handleMarkerDragEnd}
                />
              )}
            </GoogleMap>
          )}

          {/* Map Link  */}
          <Form.Item
            label="Map Link"
            name="map_link"
            style={{ marginTop: "16px" }}
          >
            <Input
              style={{ width: "100%" }}
              placeholder="Enter Security Deposit"
            />
          </Form.Item>

          {/* Landmark  */}
          <Form.Item
            label="Land Mark"
            name="landmark"
            style={{ marginTop: "16px" }}
          >
            <Input style={{ width: "100%" }} placeholder="Enter Landmark" />
          </Form.Item>
          {/* Room Size (sq.ft) */}
          <Form.Item label="Room Size (sq.ft)">
            <Input.Group compact>
              <Form.Item name={["room_size_min"]} noStyle>
                <Input style={{ width: 150 }} placeholder="Min" type="number" />
              </Form.Item>
              {/* <span style={{ margin: "0 8px" }}>to</span> */}
              <Form.Item name={["room_size_max"]} noStyle>
                <Input style={{ width: 150 }} placeholder="Max" type="number" />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          {/* Hostel Types */}
          <Form.Item label="Hostel Type" name="hostel_type">
            <Checkbox.Group options={hostelTypeOptions} />
          </Form.Item>
          {/* Furnishing Status */}
          <Form.Item
            label="Furnishing Status & Features"
            name="furnishing_status"
          >
            <Checkbox.Group options={furnishingOptions} />
          </Form.Item>
          {/* Bathrooms */}
          <Form.Item label="Bathroom Type" name="bathroom_type">
            <Checkbox.Group options={bathroomTypeOptions} />
          </Form.Item>
          {/* Yes/No toggles for amenities */}
          {[
            { label: "Wifi", name: "wifi" },
            { label: "Ac/Non-AC", name: "ac" },
            { label: "Laundry Service", name: "laundry_service" },
            { label: "Housekeeping", name: "housekeeping" },
            { label: "Hot Water / Geyser", name: "hot_water" },
            { label: "Power Backup", name: "power_backup" },
            { label: "Parking Available", name: "parking" },
            { label: "Gym", name: "gym" },
            { label: "Play Area", name: "play_area" },
            { label: "TV", name: "tv" },
            { label: "Dining Table", name: "dining_table" },
            { label: "Security", name: "security" },
            { label: "RO Drinking Water", name: "ro_water" },
            { label: "Study Area", name: "study_area" },
            { label: "Smoking Allowed", name: "smoking_allowed" },
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
            { label: "Tea/Coffee", name: "tea_coffee" },
            { label: "Snacks", name: "snacks" },
          ].map(({ label, name }) => (
            <Form.Item key={name} label={label} name={name}>
              <Radio.Group options={yesNoOptions} />
            </Form.Item>
          ))}

          {/* Timing */}
          <p className="font-bold text-[#7C0902]">Set Timing</p>
          <Form.Item
            label="Breakfast Timing"
            name="breakfast_timing"
            // rules={[
            //   { required: true, message: "Please select breakfast timing!" },
            // ]}
          >
            <TimePicker
              style={{ width: "100%" }}
              format="HH:mm" // 24-hour format, change to "hh:mm A" for 12-hour
              placeholder="Select Breakfast Timing"
              defaultOpenValue={dayjs("00:00", "HH:mm")}
            />
          </Form.Item>
          {/* Tea/Coffee Timing */}
          <Form.Item label="Tea/Coffee Timing" name="tea_toffee_timing">
            <TimePicker
              style={{ width: "100%" }}
              format="HH:mm"
              placeholder="Select Tea/Coffee Timing"
              defaultOpenValue={dayjs("00:00", "HH:mm")}
            />
          </Form.Item>
          {/* Lunch Timing */}
          <Form.Item label="Lunch Timing" name="lunch_timing">
            <TimePicker
              style={{ width: "100%" }}
              format="HH:mm"
              placeholder="Select Lunch Timing"
              defaultOpenValue={dayjs("00:00", "HH:mm")}
            />
          </Form.Item>
          {/* Snacks Timing */}
          <Form.Item label="Snacks Timing" name="snacks_timing">
            <TimePicker
              style={{ width: "100%" }}
              format="HH:mm"
              placeholder="Select Snacks Timing"
              defaultOpenValue={dayjs("00:00", "HH:mm")}
            />
          </Form.Item>
          {/* Dinner Timing */}
          <Form.Item label="Dinner Timing" name="dinner_timing">
            <TimePicker
              style={{ width: "100%" }}
              format="HH:mm"
              placeholder="Select Dinner Timing"
              defaultOpenValue={dayjs("00:00", "HH:mm")}
            />
          </Form.Item>
          {/* Gate Closing Timing */}
          <Form.Item label="Gate Closing Timing" name="gate_closing_timing">
            <TimePicker
              style={{ width: "100%" }}
              format="HH:mm"
              placeholder="Select Gate Closing Timing"
              defaultOpenValue={dayjs("00:00", "HH:mm")}
            />
          </Form.Item>
          {/* Gate Open Timing */}
          <Form.Item label="Gate Open Timing" name="gate_opening_timing">
            <TimePicker
              style={{ width: "100%" }}
              format="HH:mm"
              placeholder="Select Gate Opening Timing"
              defaultOpenValue={dayjs("00:00", "HH:mm")}
            />
          </Form.Item>
          {/* Document Required */}
          <Form.Item label="Document Required" name="documents_required">
            <Input
              style={{ width: "100%" }}
              placeholder="Enter Document Required (eg. ID, Passport)"
            />
          </Form.Item>
          {/* Rules AND Policies */}
          {/* <Form.Item label="Rules & Policies" name="rules_policies">
            <Checkbox.Group options={rulesPoliciesOptions} />
          </Form.Item> */}
          {/* Rules and Polices */}
          <Form.Item label="Rules & Policies" name="rules_policies">
            <TextArea rows={2} placeholder="Enter Rules & Policies." />
          </Form.Item>
          {/* smoking policy */}
          {[
            { label: "Smoking Allowed", name: "smoking_allowed" },
            { label: "Alcohol Allowed", name: "alcohol" },
            { label: "Pets Allowed", name: "pets_allowed" },
          ].map(({ label, name }) => (
            <Form.Item key={name} label={label} name={name}>
              <Radio.Group options={yesNoOptions} />
            </Form.Item>
          ))}
          {/* <Form.Item
            label="Smoking & Alcohol Policy"
            name="smoking_alcohol_policy"
          >
            <TextArea rows={2} placeholder="Enter Rules & Policies." />
          </Form.Item> */}
          {/* Deposit policy */}
          <Form.Item
            label="Deposit & Refund Policies"
            name="deposit_refund_policy"
          >
            <TextArea rows={2} placeholder="Enter Deposit & Refund Policies." />
          </Form.Item>
          {/* Menue Images */}
          <Form.Item
            label="Menu Images (max 5)"
            name="menu_images"
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
