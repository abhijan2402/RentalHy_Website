export function convertToIST(utcDateString) {
  if (!utcDateString) return "";

  // Parse UTC date
  const utcDate = new Date(utcDateString);

  // Convert to IST using Intl API
  const istDate = utcDate.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return istDate;
}

export function capitalizeFirstLetter(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Function to get Location
export async function getAddressFromLatLong(lat, long) {
  // ✅ Guard clause
  if (lat == null || long == null || lat === "" || long === "") {
    console.warn("Lat/Long is missing, skipping API call.");
    return "NA";
  }

  const apiKey = `AIzaSyDzX3Hm6mNG2It5znswq-2waUHj8gVUCVk`;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      return data.results[0].formatted_address;
    } else {
      return "No address found for these coordinates.";
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    return null;
  }
}

// Function to get Lat $ Long
export async function getLatLngFromAddress(address) {
  const apiKey = import.meta.env.VITE_MAP_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    } else {
      console.error("Geocoding failed:", data.status, data.error_message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching geocode:", error);
    return null;
  }
}

export function cleanFormValues(obj) {
  if (Array.isArray(obj)) {
    return obj
      .map(cleanFormValues) // clean nested values
      .filter((v) => v !== null && v !== undefined && v !== ""); // remove empty
  } else if (typeof obj === "object" && obj !== null) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const cleanedValue = cleanFormValues(value);
      if (
        cleanedValue !== null &&
        cleanedValue !== undefined &&
        cleanedValue !== "" &&
        !(
          typeof cleanedValue === "object" &&
          !Array.isArray(cleanedValue) &&
          Object.keys(cleanedValue).length === 0
        ) // remove empty objects
      ) {
        acc[key] = cleanedValue;
      }
      return acc;
    }, {});
  }
  return obj;
}
