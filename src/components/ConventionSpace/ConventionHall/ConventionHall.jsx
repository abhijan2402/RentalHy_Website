import React, { useState } from "react";
import PropertyFilters from "../../Properties/PropertyFilters";

import { MdFilterList } from "react-icons/md";
import { GiDoor } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import PropertyList from "../../Properties/PropertyList";
import ConventionHallList from "./ConventionHallList";
import ConventionFilters from "./ConventionFilters";

export default function ConventionHall() {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);

  return (
    <>
      {/* Heading + Filters Open Btn */}
      <div className=" mx-auto flex flex-col md:flex-row md:justify-between md:items-center  text-left gap-0 px-4 sm:px-4 mt-6 md:px-6">
        {/* Left side heading */}
        <div className="flex-1">
          <h1 className="text-2xl sm:text-2xl md:text-2xl font-bold text-gray-800">
            Explore <span className="text-[#7C0902]">Convention Halls</span>
          </h1>
          <p className="mt-1 text-[#7C0902] text-[14px] sm:text-[13px] md:text-[14px]">
            Find your ideal Hall from our curated listings
          </p>
        </div>
      </div>

      {/* Property List */}
      <div className="bg-gradient-to-br flex flex-col from-white via-gray-50 to-gray-100 min-h-screen px-3 sm:px-4 md:px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-6 w-full">
          <ConventionHallList
            openFilters={openFilters}
            setOpenFilters={setOpenFilters}
          />
        </div>
      </div>

      {/* Filters Modal */}
      <ConventionFilters
        isOpen={openFilters}
        onClose={() => setOpenFilters(false)}
      />
    </>
  );
}
