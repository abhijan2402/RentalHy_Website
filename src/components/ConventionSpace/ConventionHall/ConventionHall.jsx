import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConventionHallList from "./ConventionHallList";
import ConventionFilters from "./ConventionFilters";
import IconButtons from "../../IconButtons";
import { useConventionFilters } from "../../../hooks/useConvenstionFilters";
import BookConventionSpace from "./BookConventionSpace/BookConventionSpace";

export default function ConventionHall() {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);
  const [openBookingModal, setOpenBookingModal] = useState(false);
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
  } = useConventionFilters();

  const handleApplyFilters = () => {
    applyFilters();
    setOpenFilters(false);
  };

  return (
    <>
      {/* Heading + Filters Open Btn */}
      <div className=" mx-auto flex flex-col lg:flex-row lg:justify-between lg:items-center text-left gap-2 lg:gap-2 md:gap-4 px-4 sm:px-4 mt-6 md:px-6">
        {/* Left side heading */}
        <div className="flex-1">
          <h1 className="text-2xl sm:text-2xl md:text-2xl font-bold text-gray-800">
            Explore
            <span className="text-[#7C0902]"> Convention/Functions Halls</span>
          </h1>

          <p className="mt-1 text-[#7C0902] text-[14px] sm:text-[13px] md:text-[14px]">
            Find your ideal Convention/Functions Hall from our curated listings
          </p>
        </div>
        {/* Right side: Button */}
        <div className="w-full md:w-auto flex justify-start md:justify-start ">
          <IconButtons />
        </div>
      </div>
      {/* Property List */}
      <div className=" flex flex-col from-white via-gray-50 to-gray-100 min-h-screen px-3 sm:px-4 md:px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-6 w-full">
          <ConventionHallList
            openBookingModal={openBookingModal}
            setOpenBookingModal={setOpenBookingModal}
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

      <ConventionFilters
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

      {/* Booking Modal */}
      <BookConventionSpace
        isOpen={openBookingModal}
        onClose={() => setOpenBookingModal(false)}
      />
    </>
  );
}
