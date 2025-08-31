import React, { useState } from "react";
import PropertyFilters from "../components/Properties/PropertyFilters";
import PropertyList from "../components/Properties/PropertyList";
import { MdFilterList } from "react-icons/md";
import { GiDoor } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import IconButtons from "../components/IconButtons";
import { usePropertyFilters } from "../hooks/usePropertyFilters";

export default function PropertiesPage() {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);
  const {
    data,
    propertyData,
    error,
    isLoading,
    search,
    searchKeyword,
    sort,
    perpage,
    handleSearchInputChange,
    handleSearchButton,
    handleSortChange,
    handleItemsPerPage,
    resetCategory,
    handlePriceChange,
    handleInputChange,
    handleCheckboxChange,
    filters,
  } = usePropertyFilters();
  return (
    <>
      {/* Heading + Filters Open Btn */}
      <div className="md:mx-28 flex flex-col md:flex-row md:justify-between md:items-center  text-left gap-0 px-4 sm:px-4 mt-6 md:px-6">
        {/* Left side: Heading and description */}
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            Explore <span className="text-[#7C0902]">Properties</span>
          </h1>
          <p className="mt-1 text-[#7C0902] text-[14px] sm:text-[15px] md:text-[16px]">
            Find your ideal home from our curated listings
          </p>
        </div>

        {/* Right side: Button */}
        <div className="w-full md:w-auto flex justify-start md:justify-end">
          <IconButtons />
        </div>
      </div>

      {/* Property List */}
      <div className=" flex flex-col from-white via-gray-50 to-gray-100 min-h-screen px-3 sm:px-4 md:px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-6 w-full">
          <PropertyList
            openFilters={openFilters}
            setOpenFilters={setOpenFilters}
          />
        </div>
      </div>
    </>
  );
}
