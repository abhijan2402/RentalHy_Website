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
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { useAddConventionMutation } from "../../../redux/api/conventionApi";
import { toast } from "react-toastify";
import { getLatLngFromAddress } from "../../../utils/utils";
import { useLocationCoord } from "../../../contexts/LocationContext";
import {
  GoogleMap,
  MarkerF,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import { MdOutlineMyLocation } from "react-icons/md";

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
};

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
  const [addConvention, { error, isLoading }] = useAddConventionMutation();

  const [farmImages, setfarmImages] = useState([]);
  const [roomImages, setroomImages] = useState([]);

  const [selectedDates, setSelectedDates] = useState([]);
  // Store unavailable dates as array of moments (can be individual or ranges)
  const [unavailableDatesRanges, setUnavailableDatesRanges] = useState([]);

  const [markerPos, setMarkerPos] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [searchText, setSearchText] = useState("");

  const autocompleteRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
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
      const loc = { lat: latitude, lng: longitude };
      setDefaultCenter(loc);
      setMarkerPos(loc);
      setMapCenter(loc);
      setSearchText(`${area || ""} ${city || ""}`.trim() || "");
    }
  }, [isLoaded]);

  // Replace your handleRecenter with this:
  const handleRecenter = () => {
    if (isLoaded && navigator.geolocation) {
      const loc = { lat: latitude, lng: longitude };
      setDefaultCenter(loc);
      setMarkerPos(loc);
      setMapCenter(loc);
      setSearchText(`${area || ""} ${city || ""}`.trim() || "");
    }
  };

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

      form.setFieldsValue({
        location: address,
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

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: pos }, (results, status) => {
      if (status === "OK" && results[0]) {
        const address = results[0].formatted_address;
        form.setFieldsValue({
          location: address,
          // lat: pos.lat,
          // long: pos.lng,
        });
        setSearchText(address);
      }
    });
  };

  // ✅ Marker drag
  const handleMarkerDragEnd = (e) => {
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarkerPos(pos);
    setMapCenter(pos);

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: pos }, (results, status) => {
      if (status === "OK" && results[0]) {
        const address = results[0].formatted_address;
        form.setFieldsValue({
          location: address,
          // lat: pos.lat,
          // long: pos.lng,
        });
        setSearchText(address);
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

  const handleChangeFactory =
    (setFn) =>
    ({ fileList }) => {
      setFn(fileList.slice(0, maxImages));
    };

  // Disable dates that are already selected
  const disabledDate = (current) => {
    if (!current) return false;
    return selectedDates.some(({ date }) => date.isSame(current, "day"));
  };

  // On date pick, toggle selection
  const onDateChange = (date) => {
    if (!date) return;
    setSelectedDates((prev) => {
      const foundIndex = prev.findIndex((d) => d.date.isSame(date, "day"));
      let newDates;
      if (foundIndex >= 0) {
        // Date already exists, toggle off (remove)
        newDates = prev.filter((d) => !d.date.isSame(date, "day"));
      } else {
        // Add new date with default option: full
        newDates = [...prev, { date, option: "full" }];
      }

      // Update form with formatted strings including option
      form.setFieldsValue({
        unavailableDates: newDates.map(({ date, option }) => ({
          date: date.format("YYYY-MM-DD"),
          option,
        })),
      });
      return newDates;
    });
  };

  const removeDate = (dateToRemove) => {
    setSelectedDates((prev) => {
      const newDates = prev.filter((d) => !d.date.isSame(dateToRemove, "day"));
      form.setFieldsValue({
        unavailableDates: newDates.map(({ date, option }) => ({
          date: date.format("YYYY-MM-DD"),
          option,
        })),
      });
      return newDates;
    });
  };

  const appendDatesToFormData = (formData, dates) => {
    const mapOption = {
      full: "full_day",
      day: "day",
      night: "night",
    };

    dates.forEach(({ date, option }) => {
      const mDate = moment(date, "YYYY-MM-DD");
      const key = `dates[${mDate.format("DD/MM/YYYY")}]`;
      const value = mapOption[option] || "full_day";
      formData.append(key, value);
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

    let coords = null;
    if (values.location) {
      coords = await getLatLngFromAddress(values.location);
    }

    console.log(coords);

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

    appendDatesToFormData(formData, values.unavailableDates || []);

    if (coords) {
      formData.append("lat", coords.lat.toString());
      formData.append("long", coords.lng.toString());
    }
    formData.append("type", "farm");

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

          {/* Map + Recenter Button */}
          <div className="relative">
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

            {/* ✅ Custom recenter button */}
            <button
              type="button"
              onClick={handleRecenter}
              style={{
                position: "absolute",
                top: 10,
                right: 60,
                zIndex: 9999,
                width: "38px",
                height: "38px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                background: "#fff",
                border: "1px solid #ccc",
                boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                cursor: "pointer",
              }}
            >
              <MdOutlineMyLocation
                className="w-5 h-5 text-red-800"
                aria-hidden="true"
              />
            </button>
          </div>

          {/* Price Options with individual inputs*/}
          <Form.Item
            label="Price Options"
            style={{ marginBottom: 0, marginTop: "16px" }}
          >
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
                  .sort((a, b) => a.date.valueOf() - b.date.valueOf())
                  .map(({ date, option }, i) => (
                    <li key={i} className="flex justify-between items-center">
                      <span>{date.format("YYYY-MM-DD")}</span>
                      <select
                        value={option}
                        onChange={(e) => {
                          const newOption = e.target.value;
                          setSelectedDates((prev) => {
                            const updated = prev.map((d) =>
                              d.date.isSame(date, "day")
                                ? { ...d, option: newOption }
                                : d
                            );
                            form.setFieldsValue({
                              unavailableDates: updated.map(
                                ({ date, option }) => ({
                                  date: date.format("YYYY-MM-DD"),
                                  option,
                                })
                              ),
                            });
                            return updated;
                          });
                        }}
                        style={{ marginLeft: 8 }}
                      >
                        <option value="full">Full Day</option>
                        <option value="day">Day</option>
                        <option value="night">Night</option>
                      </select>
                      <Button
                        type="link"
                        danger
                        size="small"
                        onClick={() => removeDate(date)}
                        style={{ padding: 0, marginLeft: 8 }}
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
