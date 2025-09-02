import React, { useState } from "react";
import { FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Form, Radio } from "antd";

const PRIMARY_COLOR = "#7C0902";

const FilterSection = ({ title, open, setOpen, children }) => (
  <div className="border-b border-gray-200 pb-3">
    <button
      onClick={() => setOpen(!open)}
      className="w-full flex justify-between items-center py-2 font-semibold text-gray-700 hover:text-[#7C0902] transition-colors"
    >
      {title} {open ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
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

const Chip = ({ label, selected, onClick }) => (
  <button
    className={`px-3 py-1 rounded-full border transition-colors ${
      selected
        ? "bg-[#7C0902] text-white border-[#7C0902]"
        : "bg-white text-gray-700 border-gray-300"
    }`}
    onClick={onClick}
    type="button"
  >
    {label}
  </button>
);

export default function ConventionFilters({
  isOpen,
  onClose,
  pendingFilters,
  setPendingFilters,
  onApply,
  resetFilters,
  toggleFilterValue,
  handleRangeChange,
  isSelected,
  filters,
  toggleYesNo,
}) {
  const [sections, setSections] = useState({
    priceRange: true,
    roomType: true,
    gender: true,
    facilities: true,
    foodOptions: true,
  });

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
              Farm/Resort Filters
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
            {/* // Add Yes/No toggles for each feature: */}
            {Object.entries(filters.yesNoToggles).map(([key, label]) => (
              <Form.Item
                label={key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                key={key}
              >
                <Radio.Group
                  onChange={(e) => toggleYesNo(key, e.target.value)}
                  value={pendingFilters.yesNoToggles[key]}
                  options={[
                    { label: "Yes", value: "1" },
                    { label: "No", value: "0" },
                  ]}
                />
              </Form.Item>
            ))}

            {/* // Price range slider (updated min max) */}
            <FilterSection
              title="Price (per month)"
              open={sections.priceRange}
              setOpen={(v) => setSections((p) => ({ ...p, priceRange: v }))}
            />
            <Slider
              range
              min={1000}
              max={1000000}
              step={1000}
              value={pendingFilters.priceRange}
              onChange={(range) => handleRangeChange("priceRange", range)}
              trackStyle={{ backgroundColor: PRIMARY_COLOR }}
              handleStyle={[
                { borderColor: PRIMARY_COLOR },
                { borderColor: PRIMARY_COLOR },
              ]}
            />
            <div className="flex justify-between text-black text-sm mt-2">
              <span>₹{pendingFilters.priceRange[0]}</span>
              <span>₹{pendingFilters.priceRange[1]}+</span>
            </div>
          </div>
          {/* Footer */}
          <div className="flex justify-end gap-4 mt-4 flex-shrink-0">
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Reset
            </button>
            <button
              onClick={onApply ?? (() => {})}
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
