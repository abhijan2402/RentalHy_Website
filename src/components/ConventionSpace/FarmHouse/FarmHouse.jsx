import React, { useState } from "react";
import PropertyFilters from "../../Properties/PropertyFilters";

import { useNavigate } from "react-router-dom";

import FarmHouseList from "./FarmHouseList";
import FarmHouseFilters from "./FarmHouseFilters";
import IconButtons from "../../IconButtons";
import { useFarmFilters } from "../../../hooks/useFarmFilters";

export default function FarmHouse() {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);
  const {
    data,
    isLoading,
    error,
    search,
    searchKeyword,
    sort,
    filters,
    setFilters,
    pendingFilters,
    setPendingFilters,
    toggleFilterValue,
    handleRangeChange,
    resetFilters,
    applyFilters,
    isSelected,
    toggleYesNo,
    handleSearchInputChange,
    handleSearchButton,
    handleSortChange,
    setPageNo,
  } = useFarmFilters();

  const handleApplyFilters = () => {
    applyFilters(); // commit staged filters
    setOpenFilters(false); // close modal // Optionally trigger API call here with filters or pendingFilters // console.log("Filters applied:", filters);
  };

  return (
    <>
      {/* Heading + Filters Open Btn */}
      <div className=" mx-auto flex flex-col md:flex-row md:justify-between md:items-center  text-left gap-0 px-4 sm:px-4 mt-6 md:px-6">
        {/* Left side heading */}
        <div className="flex-1">
          <h1 className="text-2xl sm:text-2xl md:text-2xl font-bold text-gray-800">
            Explore <span className="text-[#7C0902]">Resorts/Farm Houses</span>
          </h1>
          <p className="mt-1 text-[#7C0902] text-[14px] sm:text-[13px] md:text-[14px]">
            Find your ideal Resorts/Farms from our curated listings
          </p>
        </div>

        {/* Right side: Button */}
        <div className="w-full md:w-auto flex justify-start md:justify-end">
          <IconButtons />
        </div>
      </div>

      {/* Property List */}
      <div className="bg-gradient-to-br flex flex-col from-white via-gray-50 to-gray-100 min-h-screen px-3 sm:px-4 md:px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-6 w-full">
          <FarmHouseList
            openFilters={openFilters}
            setOpenFilters={setOpenFilters}
            handleSearchInputChange={handleSearchInputChange}
            handleSearchButton={handleSearchButton}
            handleSortChange={handleSortChange}
            search={search}
            searchKeyword={searchKeyword}
            sort={sort}
            data={data}
            isLoading={isLoading}
            error={error}
            setPageNo={setPageNo}
          />
        </div>
      </div>

      {/* Filters Modal */}
      <FarmHouseFilters
        isOpen={openFilters}
        onClose={() => setOpenFilters(false)}
        filters={filters}
        setFilters={setFilters}
        pendingFilters={pendingFilters}
        setPendingFilters={setPendingFilters}
        toggleFilterValue={toggleFilterValue}
        toggleYesNo={toggleYesNo}
        handleRangeChange={handleRangeChange}
        resetFilters={resetFilters}
        applyFilters={applyFilters}
        isSelected={isSelected}
        onApply={handleApplyFilters}
      />
    </>
  );
}
