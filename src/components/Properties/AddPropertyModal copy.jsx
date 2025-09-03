import React, { useRef, useState, useEffect } from "react";
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
import {
  GoogleMap,
  MarkerF,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useLocationCoord } from "../../contexts/LocationContext";

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
};
const { Option } = Select;
const { Group: CheckboxGroup } = Checkbox;

const normFile = (e) => {
  if (Array.isArray(e)) return e;
  return e && e.fileList;
};

const bhkOptions = ["1RK", "1BHK", "2BHK", "3BHK", "4BHK+", "5BHK+"];
const furnishingOptions = ["Furnished", "Semi-Furnished", "Unfurnished"];
const tenantOptions = ["Family", "Bachelors male", "Bachelors female"];

const AddPropertyModal = ({ showModal, onClose }) => {
  const horizontalScrollClass =
    "flex gap-2 overflow-x-auto flex-nowrap md:overflow-x-visible md:flex-wrap";

  const { latitude, longitude } = useLocationCoord();
  const [defaultCenter, setDefaultCenter] = useState({
    lat: latitude || 20.5937,
    lng: longitude || 78.9629,
  });

  const [addProperty, { isLoading }] = useAddPropertyMutation();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
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
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMarkerPos(pos);
          setMapCenter(pos);
          form.setFieldsValue({ lat: pos.lat, long: pos.lng });

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

      form.setFieldsValue({
        location: address,
        lat: pos.lat,
        long: pos.lng,
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
          lat: pos.lat,
          long: pos.lng,
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
          lat: pos.lat,
          long: pos.lng,
        });
        setSearchText(address);
      }
    });
  };

  const handleBeforeUpload = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      message.error("You can only upload JPEG, PNG, or JPG image files!");
      return Upload.LIST_IGNORE;
    }
    if (fileList.length >= 5) {
      message.error("You can upload up to 5 images only!");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(0, 5));
  };

  const onFinish = async (values) => {
    console.log(values);
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
        disabled: isLoading,
        loading: isLoading,
      }}
      cancelButtonProps={{
        style: { borderColor: "#7C0902", color: "#7C0902" },
      }}
      width="800px"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
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

        {/* Hidden lat/lng fields */}
        <Form.Item name="lat" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="long" hidden>
          <Input />
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
