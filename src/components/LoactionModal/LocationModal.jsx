import React, { useState, useCallback } from "react";
import { Modal, Button } from "antd";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { useLocationCoord as useLocContext } from "../../contexts/LocationContext";

const libraries = ["places"];

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
      title="Select your location"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
      ]}
    >
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <input
          type="text"
          placeholder="Search location"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C0902]"
        />
      </Autocomplete>
    </Modal>
  );
}
