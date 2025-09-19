import React, { createContext, useContext, useState, useEffect } from "react";

const defaultLocation = {
  latitude: 20.5937,
  longitude: 78.9629,
  city: "India",
  area: "Default Area",
  error: null,
};

const LocationContext = createContext({
  ...defaultLocation,
  setLocation: () => {},
});

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(defaultLocation);

  console.log(location)

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({ ...defaultLocation, error: "Geolocation not supported" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const geoData = await fetchReverseGeocode(lat, lng);
          setLocation({
            latitude: lat,
            longitude: lng,
            city: geoData.city,
            area: geoData.area,
            error: null,
          });
        } catch (error) {
          setLocation({ ...defaultLocation, error: "Reverse geocode failed" });
        }
      },
      () => {
        setLocation({
          ...defaultLocation,
          error: "Geolocation permission denied",
        });
      }
    );
  }, []);

  return (
    <LocationContext.Provider value={{ ...location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationCoord() {
  return useContext(LocationContext);
}

async function fetchReverseGeocode(lat, lng) {
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_MAP_KEY;

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
  );

  const data = await response.json();
  if (data.status !== "OK" || !data.results.length) {
    throw new Error("No geocode results found");
  }

  let city = "";
  let area = "";

  for (const result of data.results) {
    for (const component of result.address_components) {
      if (!city && component.types.includes("locality")) {
        city = component.long_name;
      }
      if (
        !area &&
        (component.types.includes("sublocality") ||
          component.types.includes("neighborhood"))
      ) {
        area = component.long_name;
      }
    }
    if (city && area) break;
  }

  if (!area) area = city;
  return { city, area };
}
