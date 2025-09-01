// Utility: format API keys into readable labels
const formatLabel = (key) => {
  return key
    .replace(/_/g, " ") // replace underscores with spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize first letters
};

const PricesSection = ({ property }) => {
  // Extract dynamic price-like fields
  const priceFields = Object.entries(property || {}).filter(([key, value]) => {
    // Skip booleans (true/false)
    if (typeof value === "boolean") return false;

    // Check if value looks like a number/price
    const isNumber = !isNaN(value) && value !== null && value !== "";

    // Skip irrelevant IDs and coords
    const excludedKeys = [
      "id",
      "user_id",
      "lat",
      "long",
      "seating_capacity",
      "images",
    ];

    return isNumber && !excludedKeys.includes(key);
  });

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-black mb-2">Pricing</h2>
      <p className="text-sm text-gray-500 italic mb-4">
        <span className="text-lg font-medium text-[#7C0902]">Note:</span> Below
        is the list of available pricing options for this property.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {priceFields.map(([key, value], idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl flex justify-between items-center border bg-blue-50 border-blue-300 text-blue-800 shadow-sm"
          >
            <p className="text-sm font-medium text-black">{formatLabel(key)}</p>
            <p className="text-sm font-bold text-black">
              ₹ {parseFloat(value).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricesSection;
