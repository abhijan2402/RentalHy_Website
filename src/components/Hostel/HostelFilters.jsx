import React, { useState } from "react";
import { FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const PRIMARY_COLOR = "#7C0902";

const FilterSection = ({ title, open, setOpen, children }) => (
  <div className="border-b border-gray-200 pb-3">
     {" "}
    <button
      onClick={() => setOpen(!open)}
      className="w-full flex justify-between items-center py-2 font-semibold text-gray-700 hover:text-[#7C0902] transition-colors"
    >
         {title}  {" "}
      {open ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />} {" "}
    </button>
     {" "}
    <div
      className={`mt-2 space-y-2 transition-all duration-300 ${
        open ? "max-h-full opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      }`}
    >
         {children} {" "}
    </div>
    {" "}
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
      {label}{" "}
  </button>
);

const roomTypes = [
  "Single room",
  "Double sharing",
  "Triple sharing",
  "4 Sharing",
  "Dormitory",
];
const genders = ["Boys hostel", "Girls hostel", "Co-living / Mixed"];
const facilities = [
  "WiFi",
  "AC / Non-AC",
  "Laundry service",
  "Housekeeping",
  "Hot water / Geyser",
  "Power backup",
  "Parking (2-wheeler/4-wheeler)",
  "Gym",
  "TV",
  "Dining Table",
  "Security",
  "RO Drinking Water",
  "Study Area",
];
const foodOptions = ["Veg / Non-veg", "Mess", "Breakfast", "Lunch", "Dinner"];
const stayTypes = ["Short-term (daily/weekly)", "Long-term (monthly/annual)"];
const occupancyCapacity = [
  "10-20 residents",
  "20-50 residents",
  "50+ residents",
];


export default function HostelFilters({
  isOpen,
  onClose,
  pendingFilters,
  setPendingFilters,
  applyFilters,
  resetFilters,
  toggleFilterValue,
  handleRangeChange,
  isSelected,
}) {
  const [sections, setSections] = useState({
    priceRange: true,
    roomType: true,
    gender: true,
    facilities: true,
    foodOptions: true,
    stayType: true,
    occupancyCapacity: true,
  });

  if (!isOpen) return null;

  return (
    <>
         {/* Overlay */}
        {" "}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-[9998]"
        onClick={onClose}
      />
         {/* Modal */}  {" "}
      <div className="fixed inset-0 flex items-center justify-center z-[9999]">
           {" "}
        <div className="bg-white w-full max-w-3xl mx-auto rounded-lg shadow-lg p-4 max-h-[90vh] flex flex-col">
               {/* Header */}    {" "}
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
                 {" "}
            <h2 className="text-xl font-bold text-gray-800">
                     Hostel Filters      {" "}
            </h2>
                 {" "}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200"
              title="Close"
            >
                     <FiX size={20} color={PRIMARY_COLOR} />     {" "}
            </button>
                {" "}
          </div>
              {" "}
          <div className="overflow-y-auto px-4" style={{ flexGrow: 1 }}>
                  {/* Price Range */}     {" "}
            <FilterSection
              title="Price (per month)"
              open={sections.priceRange}
              setOpen={(v) => setSections((p) => ({ ...p, priceRange: v }))}
            >
                    {" "}
              <Slider
                range
                min={100}
                max={25000}
                step={100}
                value={pendingFilters.priceRange}
                onChange={(range) => handleRangeChange("priceRange", range)}
                trackStyle={{ backgroundColor: PRIMARY_COLOR }}
                handleStyle={[
                  { borderColor: PRIMARY_COLOR },
                  { borderColor: PRIMARY_COLOR },
                ]}
              />
                    {" "}
              <div className="flex justify-between text-black text-sm mt-2">
                        <span>₹{pendingFilters.priceRange[0]}</span> 
                      <span>₹{pendingFilters.priceRange[1]}</span>   
                  {" "}
              </div>
                   {" "}
            </FilterSection>
                  {/* Multi-select Sections */}     {" "}
            <FilterSection
              title="Room Type"
              open={sections.roomType}
              setOpen={(v) => setSections((p) => ({ ...p, roomType: v }))}
            >
                    {" "}
              <div className="flex flex-wrap gap-2">
                       {" "}
                {roomTypes.map((rt) => (
                  <Chip
                    key={rt}
                    label={rt}
                    selected={isSelected("roomTypes", rt)}
                    onClick={() => toggleFilterValue("roomTypes", rt)}
                  />
                ))}
                      {" "}
              </div>
                   {" "}
            </FilterSection>
                 {" "}
            <FilterSection
              title="Gender"
              open={sections.gender}
              setOpen={(v) => setSections((p) => ({ ...p, gender: v }))}
            >
                    {" "}
              <div className="flex flex-wrap gap-2">
                       {" "}
                {genders.map((g) => (
                  <Chip
                    key={g}
                    label={g}
                    selected={isSelected("genders", g)}
                    onClick={() => toggleFilterValue("genders", g)}
                  />
                ))}
                      {" "}
              </div>
                   {" "}
            </FilterSection>
                 {" "}
            <FilterSection
              title="Facilities"
              open={sections.facilities}
              setOpen={(v) => setSections((p) => ({ ...p, facilities: v }))}
            >
                    {" "}
              <div className="flex flex-wrap gap-2">
                       {" "}
                {facilities.map((f) => (
                  <Chip
                    key={f}
                    label={f}
                    selected={isSelected("facilities", f)}
                    onClick={() => toggleFilterValue("facilities", f)}
                  />
                ))}
                      {" "}
              </div>
                   {" "}
            </FilterSection>
                 {" "}
            <FilterSection
              title="Food Options"
              open={sections.foodOptions}
              setOpen={(v) => setSections((p) => ({ ...p, foodOptions: v }))}
            >
                    {" "}
              <div className="flex flex-wrap gap-2">
                       {" "}
                {foodOptions.map((food) => (
                  <Chip
                    key={food}
                    label={food}
                    selected={isSelected("foodOptions", food)}
                    onClick={() => toggleFilterValue("foodOptions", food)}
                  />
                ))}
                      {" "}
              </div>
                   {" "}
            </FilterSection>
                 {" "}
            <FilterSection
              title="Stay Type"
              open={sections.stayType}
              setOpen={(v) => setSections((p) => ({ ...p, stayType: v }))}
            >
                    {" "}
              <div className="flex flex-wrap gap-2">
                       {" "}
                {stayTypes.map((st) => (
                  <Chip
                    key={st}
                    label={st}
                    selected={isSelected("stayTypes", st)}
                    onClick={() => toggleFilterValue("stayTypes", st)}
                  />
                ))}
                      {" "}
              </div>
                   {" "}
            </FilterSection>
                 {" "}
            <FilterSection
              title="Occupancy Capacity"
              open={sections.occupancyCapacity}
              setOpen={(v) =>
                setSections((p) => ({ ...p, occupancyCapacity: v }))
              }
            >
                    {" "}
              <div className="flex flex-wrap gap-2">
                       {" "}
                {occupancyCapacity.map((oc) => (
                  <Chip
                    key={oc}
                    label={oc}
                    selected={isSelected("occupancyCapacity", oc)}
                    onClick={() => toggleFilterValue("occupancyCapacity", oc)}
                  />
                ))}
                      {" "}
              </div>
                   {" "}
            </FilterSection>
                {" "}
          </div>
               {/* Footer */}    {" "}
          <div className="flex justify-end gap-4 mt-4 flex-shrink-0">
                 {" "}
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
                     Reset      {" "}
            </button>
                 {" "}
            <button
              onClick={applyFilters}
              className="px-4 py-2 rounded bg-[#7C0902] text-white hover:bg-[#9E0B0B]"
            >
                     Apply      {" "}
            </button>
                {" "}
          </div>
             {" "}
        </div>
          {" "}
      </div>
       {" "}
    </>
  );
}
