import React, { useState } from "react";
import { FiChevronDown, FiChevronUp, FiX, FiRefreshCw } from "react-icons/fi";
import { MdFilterList } from "react-icons/md";
import Slider from "rc-slider"; // npm install rc-slider
import "rc-slider/assets/index.css";

const PRIMARY_COLOR = "#7C0902"; // theme color

const FilterSection = ({ title, open, setOpen, children }) => {
  return (
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
};

export default function PropertyFilters() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // unified filters state
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

  // section toggle state
  const [sections, setSections] = useState({
    bhk: true,
    propertyType: true,
    roomSize: true,
    priceRange: true,
    furnishing: true,
    availability: true,
    bathrooms: true,
    parking: true,
    facing: true,
    advance: true,
    tenant: true,
  });

  // handle checkbox changes
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

  // handle input changes
  const handleInputChange = (key, field, value) => {
    setFilters((prev) => {
      const updated = { ...prev[key], [field]: value };
      const newFilters = { ...prev, [key]: updated };
      console.log(newFilters);
      return newFilters;
    });
  };

  // handle price slider change
  const handlePriceChange = (range) => {
    setFilters((prev) => {
      const newFilters = { ...prev, priceRange: range };
      console.log(newFilters);
      return newFilters;
    });
  };

  // reset filters
  const resetFilters = () => {
    const resetState = {
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
    };
    setFilters(resetState);
    console.log("Filters reset:", resetState);
  };

  return (
    <>
      {/* Mobile open filters btn */}
      <div className="md:hidden flex justify-end">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center justify-center gap-2 w-full"
          style={{
            backgroundColor: PRIMARY_COLOR,
            color: "white",
            padding: "12px 16px",
            borderRadius: "6px",
          }}
        >
          <MdFilterList size={20} /> Open Filters
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
            bg-white shadow-lg p-4 space-y-4
    md:w-72 w-full
    h-full overflow-y-auto
    transition-all duration-300
    ${mobileOpen ? "fixed inset-0 z-[9999]" : "hidden"}
    md:block md:relative md:z-auto
        `}
      >
        {/* Header with Reset & Close */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Filters</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={resetFilters}
              className="p-2 rounded-full hover:bg-gray-200"
              title="Reset Filters"
            >
              <FiRefreshCw size={18} color={PRIMARY_COLOR} />
            </button>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-full hover:bg-gray-200 md:hidden"
            >
              <FiX size={20} color={PRIMARY_COLOR} />
            </button>
          </div>
        </div>

        {/* BHK */}
        <FilterSection
          title="BHK"
          open={sections.bhk}
          setOpen={(v) => setSections((p) => ({ ...p, bhk: v }))}
        >
          {[1, 2, 3, 4].map((bhk) => (
            <label key={bhk} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.bhk.includes(bhk)}
                onChange={() => handleCheckboxChange("bhk", bhk)}
              />
              {`${bhk} ${bhk >= 4 ? "BHK+" : "BHK"}`}
            </label>
          ))}
        </FilterSection>

        {/* Property Type */}
        <FilterSection
          title="Property Type"
          open={sections.propertyType}
          setOpen={(v) => setSections((p) => ({ ...p, propertyType: v }))}
        >
          {["Apartment", "Flat", "Villa"].map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.propertyType.includes(type)}
                onChange={() => handleCheckboxChange("propertyType", type)}
              />
              {type}
            </label>
          ))}
        </FilterSection>

        {/* Room Size */}
        <FilterSection
          title="Room Size (sq.ft)"
          open={sections.roomSize}
          setOpen={(v) => setSections((p) => ({ ...p, roomSize: v }))}
        >
          <div className="flex gap-2">
            <input
              type="number"
              value={filters.roomSize.min}
              placeholder="Min"
              onChange={(e) =>
                handleInputChange("roomSize", "min", e.target.value)
              }
              className="w-1/2 border rounded p-1"
            />
            <input
              type="number"
              value={filters.roomSize.max}
              placeholder="Max"
              onChange={(e) =>
                handleInputChange("roomSize", "max", e.target.value)
              }
              className="w-1/2 border rounded p-1"
            />
          </div>
        </FilterSection>

        {/* Price Range Slider */}
        <FilterSection
          title="Price Range"
          open={sections.priceRange}
          setOpen={(v) => setSections((p) => ({ ...p, priceRange: v }))}
        >
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
            <span>₹{filters.priceRange[0]}</span>
            <span>₹{filters.priceRange[1]}</span>
          </div>
        </FilterSection>

        {/* Furnishing */}
        <FilterSection
          title="Furnishing Status"
          open={sections.furnishing}
          setOpen={(v) => setSections((p) => ({ ...p, furnishing: v }))}
        >
          {["Furnished", "Semi-Furnished", "Unfurnished"].map((status) => (
            <label key={status} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.furnishing.includes(status)}
                onChange={() => handleCheckboxChange("furnishing", status)}
              />
              {status}
            </label>
          ))}
        </FilterSection>

        {/* Availability */}
        <FilterSection
          title="Availability"
          open={sections.availability}
          setOpen={(v) => setSections((p) => ({ ...p, availability: v }))}
        >
          {["Ready to Move", "Under Construction"].map((status) => (
            <label key={status} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.availability.includes(status)}
                onChange={() => handleCheckboxChange("availability", status)}
              />
              {status}
            </label>
          ))}
        </FilterSection>

        {/* Bathrooms */}
        <FilterSection
          title="Bathrooms"
          open={sections.bathrooms}
          setOpen={(v) => setSections((p) => ({ ...p, bathrooms: v }))}
        >
          <div className="flex flex-row justify-between">
            {[1, 2, 3, 4].map((count) => (
              <label key={count} className="flex items-center  gap-2">
                <input
                  type="checkbox"
                  checked={filters.bathrooms.includes(count)}
                  onChange={() => handleCheckboxChange("bathrooms", count)}
                />
                {`${count} ${count >= 4 ? "+" : ""}`}
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Parking Available For */}
        <FilterSection
          title="Parking Available For"
          open={sections.parking}
          setOpen={(v) => setSections((p) => ({ ...p, parking: v }))}
        >
          {["Car", "Bike", "Both", "None"].map((opt) => (
            <label key={opt} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.parking.includes(opt)}
                onChange={() => handleCheckboxChange("parking", opt)}
              />
              {opt}
            </label>
          ))}
        </FilterSection>

        {/* Facing Direction */}
        <FilterSection
          title="Facing Direction"
          open={sections.facing}
          setOpen={(v) => setSections((p) => ({ ...p, facing: v }))}
        >
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
            <label key={dir} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.facing.includes(dir)}
                onChange={() => handleCheckboxChange("facing", dir)}
              />
              {dir}
            </label>
          ))}
        </FilterSection>

        {/* Advance Money */}
        <FilterSection
          title="Advance Money"
          open={sections.advance}
          setOpen={(v) => setSections((p) => ({ ...p, advance: v }))}
        >
          {["1 Month", "2 Months", "3 Months+"].map((adv) => (
            <label key={adv} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.advance.includes(adv)}
                onChange={() => handleCheckboxChange("advance", adv)}
              />
              {adv}
            </label>
          ))}
        </FilterSection>

        {/* Preferred Tenant Type */}
        <FilterSection
          title="Preferred Tenant Type"
          open={sections.tenant}
          setOpen={(v) => setSections((p) => ({ ...p, tenant: v }))}
        >
          {["Family", "Bachelors Male", "Bachelors female"].map((tenant) => (
            <label key={tenant} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.tenant.includes(tenant)}
                onChange={() => handleCheckboxChange("tenant", tenant)}
              />
              {tenant}
            </label>
          ))}
        </FilterSection>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-[9998] md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
