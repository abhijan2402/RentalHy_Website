import React, { useState } from "react";
import { FaBuilding, FaRestroom } from "react-icons/fa";
import Breadcrumb from "../components/Breadcrumb";
import HostelSpace from "../components/Hostel/HostelSpace";

const Hostel = () => {
  return (
    <div className="w-full max-w-6xl mx-auto mt-[120px]">
      <Breadcrumb propertyTitle={"Hostels"} />
      {/* Tab buttons */}
      <div className="flex px-6 gap-2 mb-4 border-b border-white">
        <button
          className={`px-4 py-2 font-semibold ${"border-b-2 border-[#7C0902] text-[#7C0902]"}`}
        >
          <FaRestroom className="inline mr-2" />
          Hostels
        </button>
      </div>

      {/* Tab content */}
      <div>
        <HostelSpace />
      </div>
    </div>
  );
};

export default Hostel;
