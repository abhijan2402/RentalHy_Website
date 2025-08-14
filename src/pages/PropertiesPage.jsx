import React from "react";
import PropertyFilters from "../components/Properties/PropertyFilters";
import PropertyList from "../components/Properties/PropertyList";


export default function PropertiesPage() {
  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        <PropertyFilters />
        <PropertyList />
      </div>
    </div>
  );
}
