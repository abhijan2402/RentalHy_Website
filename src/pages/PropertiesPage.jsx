import React from "react";
import PropertyFilters from "../components/Properties/PropertyFilters";
import PropertyList from "../components/Properties/PropertyList";

export default function PropertiesPage() {
  return (
    <>
      {/* Heading + Subheading */}
      <div className="max-w-7xl mx-auto mt-8 text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Explore <span className="text-[#7C0902]">Properties</span>
        </h1>
        <p className="mt-1 text-[#7C0902] text-[14px] md:text-[16px]">
          Find your ideal home from our curated listings
        </p>
      </div>
      <div className="bg-gradient-to-br flex flex-col from-white via-gray-50 to-gray-100 min-h-screen px-3 sm:px-4 md:px-6 py-6">
        {/* Property List + Filters */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 w-full">
          {/* <PropertyFilters /> */}
          <PropertyList />
        </div>
      </div>
    </>
  );
}
