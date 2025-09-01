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
    // hour: "2-digit",
    // minute: "2-digit",
    // second: "2-digit",
  });

  return istDate;
}

export function capitalizeFirstLetter(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function getAddressFromLatLong(lat, long) {
  const apiKey = `AIzaSyDzX3Hm6mNG2It5znswq-2waUHj8gVUCVk`;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      // Return the formatted address of the first result
      return data.results[0].formatted_address;
    } else {
      return "No address found for these coordinates.";
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    return null;
  }
}
