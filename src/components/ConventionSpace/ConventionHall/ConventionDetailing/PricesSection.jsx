// Utility: format API keys into readable labels
const formatLabel = (key) => {
  return key
    .replace(/_/g, " ") // replace underscores with spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize first letters
};

const PricesSection = ({ property }) => {
  const priceFields = Object.entries(property || {}).filter(([key, value]) => {
    if (typeof value === "boolean") return false;

    const isNumber = !isNaN(value) && value !== null && value !== "";

    const excludedKeys = [
      "id",
      "user_id",
      "lat",
      "long",
      "seating_capacity",
      "images",
      "contact_number",
    ];

    return isNumber && !excludedKeys.includes(key);
  });

  // Helper: decide icon/unit
  const getUnit = (key) => {
    if (key === "room_size_min" || key === "room_size_max") {
      return "sq"; // or "sq ft", "sq m" according to context
    }
    return "₹";
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-black mb-2">Pricing</h2>
      <p className="text-sm text-gray-500 italic mb-4">
        <span className="text-lg font-medium text-[#7C0902]">Note:</span> Below
        is the list of available pricing options for this property.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
        {priceFields.map(([key, value], idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl flex justify-between items-center border bg-blue-50 border-blue-300 text-blue-800 shadow-sm"
          >
            <p className="text-[11px] font-medium text-black">
              {formatLabel(key)}
            </p>
            <p className="text-[11px] font-bold text-black">
              {parseFloat(value).toLocaleString()}{" "}
              {getUnit(key)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};


export default PricesSection;
