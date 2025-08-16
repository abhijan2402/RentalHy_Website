// PropertFilterSlider;
import React, { useState } from "react";
import { FiRefreshCw, FiX } from "react-icons/fi";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const PRIMARY_COLOR = "#7C0902";

const tabs = [
  "BHK",
  "Property Type",
  "Room Size",
  "Price",
  "Furnishing",
  "Availability",
  "Bathrooms",
  "Parking",
  "Facing",
  "Advance",
  "Tenant",
];

export default function PropertFilterSlider() {
  const [filters, setFilters] = useState({
    bhk: [],
    propertyType: [],
    roomSize: { min: "", max: "" },
    priceRange: [5000, 50000],
    furnishing: [],
    availability: [],
    bathrooms: [],
    parking: [],
    facing: [],
    advance: [],
    tenant: [],
  });

  const [activeTab, setActiveTab] = useState(null); // open modal for this tab

  const handleCheckboxChange = (key, value) => {
    setFilters((prev) => {
      const arr = prev[key];
      const updated = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      const newFilters = { ...prev, [key]: updated };
      console.log(newFilters);
      return newFilters;
    });
  };

  const handleInputChange = (key, field, value) => {
    setFilters((prev) => {
      const updated = { ...prev[key], [field]: value };
      const newFilters = { ...prev, [key]: updated };
      console.log(newFilters);
      return newFilters;
    });
  };

  const handlePriceChange = (range) => {
    setFilters((prev) => {
      const newFilters = { ...prev, priceRange: range };
      console.log(newFilters);
      return newFilters;
    });
  };

  const resetCategory = (tab) => {
    setFilters((prev) => {
      const reset = { ...prev };
      switch (tab) {
        case "BHK":
          reset.bhk = [];
          break;
        case "Property Type":
          reset.propertyType = [];
          break;
        case "Room Size":
          reset.roomSize = { min: "", max: "" };
          break;
        case "Price":
          reset.priceRange = [5000, 50000];
          break;
        case "Furnishing":
          reset.furnishing = [];
          break;
        case "Availability":
          reset.availability = [];
          break;
        case "Bathrooms":
          reset.bathrooms = [];
          break;
        case "Parking":
          reset.parking = [];
          break;
        case "Facing":
          reset.facing = [];
          break;
        case "Advance":
          reset.advance = [];
          break;
        case "Tenant":
          reset.tenant = [];
          break;
        default:
          break;
      }
      console.log("Reset:", reset);
      return reset;
    });
  };

  // ✅ Render content per tab
  const renderFilterContent = (tab) => {
    switch (tab) {
      case "BHK":
        return [1, 2, 3, 4].map((bhk) => (
          <label key={bhk} className="flex text-black items-center gap-2">
            <input
              type="checkbox"
              checked={filters.bhk.includes(bhk)}
              onChange={() => handleCheckboxChange("bhk", bhk)}
            />
            {`${bhk}${bhk >= 4 ? " BHK+" : " BHK"}`}
          </label>
        ));

      case "Property Type":
        return ["Apartment", "Flat", "Villa"].map((type) => (
          <label key={type} className="flex  text-black items-center gap-2">
            <input
              type="checkbox"
              checked={filters.propertyType.includes(type)}
              onChange={() => handleCheckboxChange("propertyType", type)}
            />
            {type}
          </label>
        ));

      case "Room Size":
        return (
          <div className="flex gap-2">
            <input
              type="number"
              value={filters.roomSize.min}
              placeholder="Min"
              onChange={(e) =>
                handleInputChange("roomSize", "min", e.target.value)
              }
              className="w-1/2 border text-black p-1 rounded"
            />
            <input
              type="number"
              value={filters.roomSize.max}
              placeholder="Max"
              onChange={(e) =>
                handleInputChange("roomSize", "max", e.target.value)
              }
              className="w-1/2 border text-black p-1 rounded"
            />
          </div>
        );

      case "Price":
        return (
          <>
            <Slider
              range
              min={0}
              max={100000}
              step={1000}
              value={filters.priceRange}
              onChange={handlePriceChange}
              trackStyle={{ backgroundColor: PRIMARY_COLOR }}
              handleStyle={[
                { borderColor: PRIMARY_COLOR },
                { borderColor: PRIMARY_COLOR },
              ]}
            />
            <div className="flex justify-between text-sm mt-2">
              <span className="text-black">₹{filters.priceRange[0]}</span>
              <span>₹{filters.priceRange}</span>
            </div>
          </>
        );

      case "Furnishing":
        return ["Furnished", "Semi-Furnished", "Unfurnished"].map((status) => (
          <label key={status} className="flex text-black items-center gap-2">
            <input
              type="checkbox"
              checked={filters.furnishing.includes(status)}
              onChange={() => handleCheckboxChange("furnishing", status)}
            />
            {status}
          </label>
        ));

      case "Availability":
        return ["Ready to Move", "Under Construction"].map((status) => (
          <label key={status} className="flex text-black items-center gap-2">
            <input
              type="checkbox"
              checked={filters.availability.includes(status)}
              onChange={() => handleCheckboxChange("availability", status)}
            />
            {status}
          </label>
        ));

      case "Bathrooms":
        return [1, 2, 3, 4].map((count) => (
          <label key={count} className="flex  text-black items-center gap-2">
            <input
              type="checkbox"
              checked={filters.bathrooms.includes(count)}
              onChange={() => handleCheckboxChange("bathrooms", count)}
            />
            {`${count}${count >= 4 ? "+" : ""}`}
          </label>
        ));

      case "Parking":
        return ["Car", "Bike", "Both", "None"].map((opt) => (
          <label key={opt} className="flex text-black items-center gap-2">
            <input
              type="checkbox"
              checked={filters.parking.includes(opt)}
              onChange={() => handleCheckboxChange("parking", opt)}
            />
            {opt}
          </label>
        ));

      case "Facing":
        return [
          "East",
          "West",
          "North",
          "South",
          "North-East",
          "North-West",
          "South-East",
          "South-West",
        ].map((dir) => (
          <label key={dir} className="flex text-black items-center gap-2">
            <input
              type="checkbox"
              checked={filters.facing.includes(dir)}
              onChange={() => handleCheckboxChange("facing", dir)}
            />
            {dir}
          </label>
        ));

      case "Advance":
        return ["1 Month", "2 Months", "3 Months+"].map((adv) => (
          <label key={adv} className="flex text-black items-center gap-2">
            <input
              type="checkbox"
              checked={filters.advance.includes(adv)}
              onChange={() => handleCheckboxChange("advance", adv)}
            />
            {adv}
          </label>
        ));

      case "Tenant":
        return ["Family", "Bachelors Male", "Bachelors Female"].map(
          (tenant) => (
            <label key={tenant} className="flex text-black items-center gap-2">
              <input
                type="checkbox"
                checked={filters.tenant.includes(tenant)}
                onChange={() => handleCheckboxChange("tenant", tenant)}
              />
              {tenant}
            </label>
          )
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Global Reset Button (visible always) */}
      {/* <button
        onClick={() => {
          setFilters({
            bhk: [],
            propertyType: [],
            roomSize: { min: "", max: "" },
            priceRange: [5000, 50000],
            furnishing: [],
            availability: [],
            bathrooms: [],
            parking: [],
            facing: [],
            advance: [],
            tenant: [],
          });
          console.log("All filters reset");
        }}
        className="ml-2 px-3 py-1 bg-red-500 text-white text-[13px] rounded hover:bg-red-600"
      >
        Reset All
      </button> */}

      {/* 📌 Tabs (Desktop + Mobile) */}
      <div className="flex md:w-full overflow-x-auto mb-4 border-b p-2 gap-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`whitespace-nowrap px-4 py-2 text-[14px] text-black border rounded 
        ${activeTab === tab ? "bg-[#7C0902] text-white" : "bg-gray-100"}
        md:flex-1 md:text-center`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 📌 Modal (same for Desktop & Mobile) */}
      {activeTab && (
        <div className="fixed inset-0  bg-black bg-opacity-40 flex items-center justify-center md:items-center md:justify-center z-50">
          {/* Card Modal in desktop, Bottom Sheet in mobile */}
          <div className="bg-white w-full md:w-1/2 md:max-w-lg rounded-t-lg md:rounded-lg p-4 max-h-[80%] overflow-y-auto absolute bottom-0 md:relative">
            <div className="flex justify-between items-center border-b pb-2 mb-2">
              <h2 className="text-lg font-semibold">{activeTab}</h2>
              <div className="flex items-center gap-2">
                <button
                  className="text-sm text-red-600"
                  onClick={() => resetCategory(activeTab)}
                >
                  <FiRefreshCw size={18} color={PRIMARY_COLOR} />
                </button>
                <button className="text-black" onClick={() => setActiveTab(null)}>
                  <FiX size={20} />
                </button>
              </div>
            </div>
            <div className="space-y-2">{renderFilterContent(activeTab)}</div>
          </div>
        </div>
      )}
    </>
  );
}
