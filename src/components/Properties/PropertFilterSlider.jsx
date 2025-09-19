// PropertFilterSlider;
import React, { useState } from "react";
import { FiRefreshCw, FiX } from "react-icons/fi";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { usePropertyFilters } from "../../hooks/usePropertyFilters";

const PRIMARY_COLOR = "#7C0902";

const tabs = [
  "BHK",
  "Property Type",
  "Preferred Tenant Type",
  "Price",
  "Commercial Space",
  "Furnishing",
  "Availability",
  "Bathrooms",
  "Parking",
  "Facing",
  "Advance",
  "Room Size",
];

export default function PropertFilterSlider({
  resetCategory,
  handlePriceChange,
  handleInputChange,
  handleCheckboxChange,
  filters,
}) {
  const [activeTab, setActiveTab] = useState(null); // open modal for this tab

  function ToggleBox({ active, onClick, children }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`px-4 py-2 rounded-lg border 
        ${
          active
            ? "bg-[#7C0902] text-white border-[#7C0902]"
            : "bg-gray-100 text-[#000]  border-transparent"
        }
        transition-colors outline-none text-[16px] `}
        style={{ minWidth: 70 }}
      >
        {children}
      </button>
    );
  }

  // ✅ Render content per tab
  const renderFilterContent = (tab) => {
    switch (tab) {
      case "BHK":
        return (
          <div className="flex gap-2 flex-wrap">
            {["1 BHK", "2 BHK", "3 BHK", "4+"].map((bhk) => (
              <ToggleBox
                key={bhk}
                active={filters.bhk.includes(bhk)}
                onClick={() => handleCheckboxChange("bhk", bhk)}
              >
                {bhk}
                {bhk >= "4+" ? " BHK" : ""}
              </ToggleBox>
            ))}
          </div>
        );

      case "Property Type":
        return (
          <div className="flex gap-2 flex-wrap">
            {["Apartment", "Flat", "Villa", "Duplex", "Tiled House", "Roof Sheets", "Independent House"].map((type) => (
              <ToggleBox
                key={type}
                active={filters.propertyType.includes(type)}
                onClick={() => handleCheckboxChange("propertyType", type)}
              >
                {type}
              </ToggleBox>
            ))}
          </div>
        );

      case "Room Size":
        return (
          <div className="flex gap-2">
            <div className="relative w-1/2">
              <input
                type="number"
                value={filters.roomSize.min}
                placeholder="Min"
                onChange={(e) =>
                  handleInputChange("roomSize", "min", e.target.value)
                }
                className="w-full border text-black p-1 rounded pr-10"
              />
              <span className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-600 text-sm pointer-events-none">
                sq.ft
              </span>
            </div>

            <div className="relative w-1/2">
              <input
                type="number"
                value={filters.roomSize.max}
                placeholder="Max"
                onChange={(e) =>
                  handleInputChange("roomSize", "max", e.target.value)
                }
                className="w-full border text-black p-1 rounded pr-10"
              />
              <span className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-600 text-sm pointer-events-none">
                sq.ft
              </span>
            </div>
          </div>
        );

      case "Price":
        return (
          <>
            <Slider
              range
              min={0}
              max={5000000}
              step={1000}
              // defaultValue={[5000, 200000]}
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
              <span className="text-black">₹{filters.priceRange[1]}</span>
            </div>
          </>
        );

      case "Commercial Space":
        return (
          <div className="flex gap-2 flex-wrap">
            {[
              "Shop",
              "Office",
              "Showroom",
              "Hotel",
              "Warehouse",
              "Godown",
              "Factory",
              "Industrial Building",
              "Coworking Space",
              "Restaurant",
              "Banquet Hall",
              "Cold Storage",
              "Any Other",
            ].map((type) => (
              <ToggleBox
                key={type}
                active={filters.commercialSpace.includes(type)}
                onClick={() => handleCheckboxChange("commercialSpace", type)}
              >
                {type}
              </ToggleBox>
            ))}
          </div>
        );

      case "Furnishing":
        return (
          <div className="flex gap-2 flex-wrap">
            {["Furnished", "Semi-Furnished", "Unfurnished"].map((status) => (
              <ToggleBox
                key={status}
                active={filters.furnishing.includes(status)}
                onClick={() => handleCheckboxChange("furnishing", status)}
              >
                {status}
              </ToggleBox>
            ))}
          </div>
        );

      case "Availability":
        return (
          <div className="flex gap-2 flex-wrap">
            {["Ready to Move", "Under Construction"].map((status) => (
              <ToggleBox
                key={status}
                active={filters.availability.includes(status)}
                onClick={() => handleCheckboxChange("availability", status)}
              >
                {status}
              </ToggleBox>
            ))}
          </div>
        );

      case "Bathrooms":
        return (
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4].map((count) => (
              <ToggleBox
                key={count}
                active={filters.bathrooms.includes(count)}
                onClick={() => handleCheckboxChange("bathrooms", count)}
              >
                {count}
                {count === 4 ? "+" : ""}
              </ToggleBox>
            ))}
          </div>
        );

      case "Parking":
        return (
          <div className="flex gap-2 flex-wrap">
            {["Car", "Bike", "Both", "None"].map((opt) => (
              <ToggleBox
                key={opt}
                active={filters.parking.includes(opt)}
                onClick={() => handleCheckboxChange("parking", opt)}
              >
                {opt}
              </ToggleBox>
            ))}
          </div>
        );

      case "Facing":
        return (
          <div className="flex gap-2 flex-wrap">
            {[
              "East",
              "West",
              "North",
              "South",
              "North-East",
              "North-West",
              "South-East",
              "South-West",
            ].map((dir) => (
              <ToggleBox
                key={dir}
                active={filters.facing.includes(dir)}
                onClick={() => handleCheckboxChange("facing", dir)}
              >
                {dir}
              </ToggleBox>
            ))}
          </div>
        );

      case "Advance":
        return (
          <div className="flex gap-2 flex-wrap">
            {["1 Month", "2 Months", "3 Months+"].map((adv) => (
              <ToggleBox
                key={adv}
                active={filters.advance.includes(adv)}
                onClick={() => handleCheckboxChange("advance", adv)}
              >
                {adv}
              </ToggleBox>
            ))}
          </div>
        );

      case "Preferred Tenant Type":
        return (
          <div className="flex gap-2  text-black flex-wrap">
            {["Family", "Bachelors male", "Bachelors female"].map((tenant) => (
              <ToggleBox
                key={tenant}
                active={filters.tenant.includes(tenant)}
                onClick={() => handleCheckboxChange("tenant", tenant)}
              >
                <span className="text-black">{tenant}</span>
              </ToggleBox>
            ))}
          </div>
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
            className={`whitespace-nowrap px-4 py-1 text-[13px] text-black border rounded  
        ${
          activeTab === tab
            ? "bg-[#7C0902] text-white"
            : "bg-red-50 border-red-200"
        }
        md:flex-1 md:text-center`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 📌 Modal (same for Desktop & Mobile) */}
      {activeTab && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center md:items-center md:justify-center z-50">
          {/* Card Modal in desktop, Bottom Sheet in mobile */}
          <div className="bg-white w-full md:w-1/2 md:max-w-lg rounded-t-lg md:rounded-lg p-4 max-h-[80%] overflow-y-auto absolute md:relative flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-2 mb-2">
              <h2 className="text-lg text-[#7C0902] font-semibold">
                {activeTab}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  className="text-sm text-red-600"
                  onClick={() => resetCategory(activeTab)}
                >
                  <FiRefreshCw size={18} color={PRIMARY_COLOR} />
                </button>
                <button
                  className="text-black"
                  onClick={() => setActiveTab(null)}
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {/* Filter Content */}
            <div className="space-y-2 flex-grow px-5 overflow-y-auto">
              {renderFilterContent(activeTab)}
            </div>

            {/* Footer with Cancel & OK buttons */}
            <div className="mt-4 pt-2 border-t flex justify-end gap-3">
              <button
                className="px-4 py-1 text-[14px] text-red-600 border border-red-600 rounded hover:bg-red-100 transition"
                onClick={() => {
                  resetCategory(activeTab);
                  setActiveTab(null);
                }}
              >
                Reset
              </button>
              <button
                className="px-4 py-2 bg-[#7C0902] text-[14px] text-white rounded hover:bg-[#a01002] transition"
                onClick={() => {
                  setActiveTab(null);
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
