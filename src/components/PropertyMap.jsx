import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
};

const center = {
  lat: 17.385044, // default (Hyderabad)
  lng: 78.486671,
};

export default function PropertyMap({ lat, lng }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_MAP_KEY,
  });

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold mb-2">Location Map</h2>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={lat && lng ? { lat: Number(lat), lng: Number(lng) } : center}
          zoom={15}
        >
          {lat && lng && (
            <MarkerF position={{ lat: Number(lat), lng: Number(lng) }} />
          )}
        </GoogleMap>
      ) : (
        <p className="text-gray-500 text-sm">Loading map...</p>
      )}
    </div>
  );
}
