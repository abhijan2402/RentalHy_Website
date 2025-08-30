import { useNavbar } from "../contexts/NavbarContext";
import { FaBuilding, FaHome, FaRestroom, FaTree } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function IconButtons() {
  const { activeButton, buttons, handleButtonClick } = useNavbar();
  const navigate = useNavigate();

  const iconMap = {
    tolet: <FaHome />,
    convention: <FaBuilding />,
    resort: <FaTree />,
    hostel: <FaRestroom />,
  };

  return (
    <div className="flex flex-wrap gap-2">
      {buttons.map((btn) => (
        <button
          key={btn.id}
          onClick={() => handleButtonClick(btn, navigate)}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded transition-colors duration-200 ${
            activeButton === btn.id
              ? "bg-[#7C0902] text-white"
              : "bg-gray-200 text-black hover:bg-gray-200"
          } w-full sm:w-auto justify-center sm:justify-start`}
          aria-pressed={activeButton === btn.id}
          style={{ minWidth: 120 }}
        >
          <span className="text-sm">{iconMap[btn.id]}</span>
          <span className="truncate text-sm font-medium">
            {btn.label === "Home" ? "To-Let" : btn.label}
         </span>
        </button>
      ))}
    </div>
  );
}
