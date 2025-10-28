import React, { useState } from "react";
import FarmHouse from "../components/ConventionSpace/FarmHouse/FarmHouse";
import Breadcrumb from "../components/Breadcrumb";

const ResortFarmHousePage = () => {
  const [activeTab, setActiveTab] = useState("farmhouse");

  return (
    <div className="w-full max-w-6xl mx-auto mt-[120px]">
      <Breadcrumb
        breadcrumbItems={[
          { title: "Home", to: "/" },
          { title: "Resort/Farm House", to: "/farm-resort" },
        ]}
      />
      {/* Tab buttons */}
      <div className="flex px-6 gap-2 mb-4 border-b border-white">
        <button
          className={`px-4 py-2 font-semibold ${
            activeTab === "farmhouse"
              ? "border-b-2 border-[#7C0902] text-[#7C0902]"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("farmhouse")}
        >
          🏡 Farm Houses
        </button>
      </div>

      {/* Tab content */}
      <div>{activeTab === "farmhouse" && <FarmHouse />}</div>
    </div>
  );
};

export default ResortFarmHousePage;
