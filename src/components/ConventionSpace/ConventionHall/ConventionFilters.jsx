import React, { useState } from "react";
import { FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const PRIMARY_COLOR = "#7C0902";

const FilterSection = ({ title, open, setOpen, children }) => (
  <div className="border-b border-gray-200 pb-3">
    <button
      onClick={() => setOpen(!open)}
      className="w-full flex justify-between items-center py-2 font-semibold text-gray-700 hover:text-[#7C0902] transition-colors"
    >
      {title}
      {open ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
    </button>
    <div
      className={`mt-2 space-y-2 transition-all duration-300 ${
        open ? "max-h-full opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      }`}
    >
      {children}
    </div>
  </div>
);

const YesNoToggle = ({ label, value, onChange }) => (
  <div className="flex  flex-col gap-4">
    <p className="text-black">{label}</p>
    <div className="flex gap-8">
      <label className="flex items-center gap-1 text-black">
        <input
          type="radio"
          checked={value === "Yes"}
          onChange={() => onChange("Yes")}
        />
        Yes
      </label>
      <label className="flex items-center gap-1 text-black">
        <input
          type="radio"
          checked={value === "No"}
          onChange={() => onChange("No")}
        />
        No
      </label>
    </div>
  </div>
);

export default function ConventionFilters({ isOpen, onClose }) {
  const [filters, setFilters] = useState({
    seatingCapacity: [50, 2000],
    valetParking: "No",
    royaltyDecoration: "No",
    royaltyKitchen: "No",
    generatorAvailable: "No",
    normalWater: "No",
    drinkingWater: "No",
    cateringPersons: "No",
    priceRange: [5000, 200000],
  });

  const [sections, setSections] = useState({
    seatingCapacity: true,
    amenities: true,
    priceRange: true,
  });

  const handleRangeChange = (key, range) => {
    setFilters((prev) => ({ ...prev, [key]: range }));
  };

  const handleToggleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    const resetState = {
      seatingCapacity: [50, 2000],
      valetParking: "No",
      royaltyDecoration: "No",
      royaltyKitchen: "No",
      generatorAvailable: "No",
      normalWater: "No",
      drinkingWater: "No",
      cateringPersons: "No",
      priceRange: [5000, 200000],
    };
    setFilters(resetState);
  };

  const applyFilters = () => {
    console.log("Applied Filters:", filters);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-[9998]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[9999]">
        <div className="bg-white w-full max-w-3xl mx-auto rounded-lg shadow-lg p-4 max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-800">
              Convention Filters
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200"
              title="Close"
            >
              <FiX size={20} color={PRIMARY_COLOR} />
            </button>
          </div>

          <div className="overflow-y-auto px-4" style={{ flexGrow: 1 }}>
            {/* Seating Capacity */}
            <FilterSection
              title="Seating Capacity"
              open={sections.seatingCapacity}
              setOpen={(v) =>
                setSections((p) => ({ ...p, seatingCapacity: v }))
              }
            >
              <Slider
                range
                min={50}
                max={2000}
                step={10}
                value={filters.seatingCapacity}
                onChange={(range) =>
                  handleRangeChange("seatingCapacity", range)
                }
                trackStyle={{ backgroundColor: PRIMARY_COLOR }}
                handleStyle={[
                  { borderColor: PRIMARY_COLOR },
                  { borderColor: PRIMARY_COLOR },
                ]}
              />
              <div className="flex justify-between text-black text-sm mt-2">
                <span>{filters.seatingCapacity[0]}</span>
                <span>{filters.seatingCapacity[1]}+</span>
              </div>
            </FilterSection>

            {/* Amenities */}
            <FilterSection
              title="Amenities"
              open={sections.amenities}
              setOpen={(v) => setSections((p) => ({ ...p, amenities: v }))}
            >
              <YesNoToggle
                label="Valet Parking"
                value={filters.valetParking}
                onChange={(val) => handleToggleChange("valetParking", val)}
              />
              <YesNoToggle
                label="Royalty for Decoration"
                value={filters.royaltyDecoration}
                onChange={(val) => handleToggleChange("royaltyDecoration", val)}
              />
              <YesNoToggle
                label="Royalty for Kitchen"
                value={filters.royaltyKitchen}
                onChange={(val) => handleToggleChange("royaltyKitchen", val)}
              />
              <YesNoToggle
                label="Generator Available"
                value={filters.generatorAvailable}
                onChange={(val) =>
                  handleToggleChange("generatorAvailable", val)
                }
              />
              <YesNoToggle
                label="Normal Water for Cooking"
                value={filters.normalWater}
                onChange={(val) => handleToggleChange("normalWater", val)}
              />
              <YesNoToggle
                label="Drinking Water Available"
                value={filters.drinkingWater}
                onChange={(val) => handleToggleChange("drinkingWater", val)}
              />
              <YesNoToggle
                label="Provides Catering Persons"
                value={filters.cateringPersons}
                onChange={(val) => handleToggleChange("cateringPersons", val)}
              />
            </FilterSection>

            {/* Price Range */}
            <FilterSection
              title="Price Range"
              open={sections.priceRange}
              setOpen={(v) => setSections((p) => ({ ...p, priceRange: v }))}
            >
              <Slider
                range
                min={5000}
                max={200000}
                step={1000}
                value={filters.priceRange}
                onChange={(range) => handleRangeChange("priceRange", range)}
                trackStyle={{ backgroundColor: PRIMARY_COLOR }}
                handleStyle={[
                  { borderColor: PRIMARY_COLOR },
                  { borderColor: PRIMARY_COLOR },
                ]}
              />
              <div className="flex justify-between text-black text-sm mt-2">
                <span>₹{filters.priceRange[0]}</span>
                <span>₹{filters.priceRange[1]}</span>
              </div>
            </FilterSection>
          </div>

          {/* Footer with Apply and Reset */}
          <div className="flex justify-end gap-4 mt-4 flex-shrink-0">
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 rounded bg-[#7C0902] text-white hover:bg-[#9E0B0B]"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
