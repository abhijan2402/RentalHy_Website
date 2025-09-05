import React, { useState, useCallback } from "react";
import { Modal, Button, Typography } from "antd";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { useLocationCoord as useLocContext } from "../../contexts/LocationContext";

const { Title, Text } = Typography;

export default function LocationModal({ isOpen, onClose }) {
  const { setLocation } = useLocContext();
  const [autocomplete, setAutocomplete] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_MAP_KEY,
    libraries: ["places"],
  });

  const onLoad = useCallback((autoC) => {
    setAutocomplete(autoC);
  }, []);

  const onPlaceChanged = () => {
    if (!autocomplete) return;

    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
      Modal.error({
        title: "Invalid Location",
        content: `No details available for: ${place.name}`,
      });
      return;
    }

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    let city = "";
    let area = "";

    place.address_components.forEach((component) => {
      if (component.types.includes("locality") && !city) {
        city = component.long_name;
      }
      if (
        (component.types.includes("sublocality") ||
          component.types.includes("neighborhood")) &&
        !area
      ) {
        area = component.long_name;
      }
    });

    if (!area) area = city || place.name;

    setLocation({
      latitude: lat,
      longitude: lng,
      city,
      area,
      error: null,
    });

    onClose();
  };

  if (!isLoaded) return null;

  return (
    <Modal
      title={null}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} className="font-semibold">
          Cancel
        </Button>,
      ]}
      maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }} // Darker overlay
      centered
    >
      <div className="mb-6 text-center">
        <Title level={3} style={{ color: "#7C0902", fontWeight: "bold" }}>
          Choose Your Perfect Spot
        </Title>
        <Text italic style={{ color: "#5a5a5a", fontSize: 16 }}>
          Search for your city, neighborhood, or a specific address to get
          started.
        </Text>
      </div>

      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <input
          type="text"
          placeholder="Start typing location..."
          className="w-full border border-gray-300 rounded px-4 py-3 text-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#7C0902] transition"
          autoFocus
        />
      </Autocomplete>
    </Modal>
  );
}
