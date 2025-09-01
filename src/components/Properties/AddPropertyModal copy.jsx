import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Input, InputNumber, Upload, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAddPropertyMutation } from "../../redux/api/propertyApi";
import { toast } from "react-toastify";
import {
  GoogleMap,
  MarkerF,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";

const normFile = (e) => (Array.isArray(e) ? e : e && e.fileList);

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
};

const defaultCenter = { lat: 17.385044, lng: 78.486671 }; // Hyderabad

const AddPropertyModal = ({ showModal, onClose }) => {
  const [addProperty, { isLoading }] = useAddPropertyMutation();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [markerPos, setMarkerPos] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  const autocompleteRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_MAP_KEY,
    libraries: ["places"],
  });

  // ✅ Detect user location on first load
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
          form.setFieldsValue({
            latitude: pos.lat,
            longitude: pos.lng,
          });

          // Optional: Reverse geocode to fill location field
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: pos }, (results, status) => {
            if (status === "OK" && results[0]) {
              form.setFieldsValue({ location: results[0].formatted_address });
            }
          });
        },
        (err) => {
          console.warn("Geolocation denied/unavailable:", err.message);
        }
      );
    }
  }, [isLoaded]);

  // When user selects a place from autocomplete
  const handlePlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      const pos = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setMarkerPos(pos);
      setMapCenter(pos);
      form.setFieldsValue({
        location: place.formatted_address || place.name,
        latitude: pos.lat,
        longitude: pos.lng,
      });
    }
  };

  // Map click handler
  const handleMapClick = (e) => {
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarkerPos(pos);
    setMapCenter(pos);
    form.setFieldsValue({ latitude: pos.lat, longitude: pos.lng });
  };

  // Marker drag handler
  const handleMarkerDragEnd = (e) => {
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarkerPos(pos);
    setMapCenter(pos);
    form.setFieldsValue({ latitude: pos.lat, longitude: pos.lng });
  };

  const handleBeforeUpload = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      message.error("You can only upload JPEG, PNG, or JPG image files!");
      return Upload.LIST_IGNORE;
    }
    if (fileList.length >= 10) {
      message.error("You can upload up to 10 images only!");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(0, 10));
  };

  const onFinish = async (values) => {
    console.log("Submitting values:", values);

    if (!values.images || values.images.length === 0) {
      toast.error("Please upload at least one property image.");
      return;
    }

    const formData = new FormData();
    try {
      Object.entries(values).forEach(([key, value]) => {
        if (key === "images") return;
        if (Array.isArray(value)) {
          value.forEach((val, idx) => {
            formData.append(`${key}[${idx}]`, val);
          });
        } else {
          formData.append(key, value);
        }
      });

      values.images.forEach((fileObj, idx) => {
        const file = fileObj.originFileObj || fileObj;
        formData.append(`images[${idx}]`, file);
      });

      await addProperty(formData).unwrap();
      toast.success("Property added successfully!");
      form.resetFields();
      setFileList([]);
      setMarkerPos(null);
      setMapCenter(defaultCenter);
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
        disabled: isLoading,
        loading: isLoading,
      }}
      cancelButtonProps={{
        style: { borderColor: "#7C0902", color: "#7C0902" },
      }}
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Property Title */}
        <Form.Item
          label="Property Title"
          name="title"
          rules={[{ required: true, message: "Please enter property title" }]}
        >
          <Input placeholder="Enter property title" />
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
              <Input placeholder="Search location" />
            </Autocomplete>
          ) : (
            <Input placeholder="Loading Google Maps..." disabled />
          )}
        </Form.Item>

        {/* Hidden lat/lng fields */}
        <Form.Item name="latitude" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="longitude" hidden>
          <Input />
        </Form.Item>

        {/* Map with draggable marker */}
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

        {/* Price */}
        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please enter price" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Enter price"
            min={0}
          />
        </Form.Item>

        {/* Images Upload */}
        <Form.Item
          label="Property Images (1-10)"
          name="images"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            { required: true, message: "Please upload at least one image" },
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
