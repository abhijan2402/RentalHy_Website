import React, { useState } from "react";
import { FaBuilding } from "react-icons/fa";
import ConventionHall from "../components/ConventionSpace/ConventionHall/ConventionHall";
import Breadcrumb from "../components/Breadcrumb";

const ConventionPage = () => {
  const [activeTab, setActiveTab] = useState("conventionhall");

  return (
    <div className="w-full max-w-6xl mx-auto mt-[120px]">
      <Breadcrumb
        breadcrumbItems={[
          { title: "Home", to: "/" },
          { title: "Convention/Function Hall", to: "/convention" },
        ]}
      />
      {/* Tab buttons */}
      <div className="flex px-6 gap-2 mb-4 border-b border-white">
        <button
          className={`px-4 py-2 font-semibold ${
            activeTab === "conventionhall"
              ? "border-b-2 border-[#7C0902] text-[#7C0902]"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("conventionhall")}
        >
          <FaBuilding className="inline mr-2" />
          Convention Halls
        </button>
      </div>

      {/* Tab content */}
      <div>{activeTab === "conventionhall" && <ConventionHall />}</div>
    </div>
  );
};

export default ConventionPage;
