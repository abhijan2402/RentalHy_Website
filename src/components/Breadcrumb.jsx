import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaChevronRight } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

export default function Breadcrumb({ propertyTitle }) {
  const { user } = useAuth();
  const path = !user ? "/" : "/";
  const navigate = useNavigate();

  return (
    <nav className="max-w-6xl mx-auto flex items-center text-sm text-gray-600 mb-6 px-4 sm:px-6">
      {/* Home */}
      <Link
        to={"/"}
        className="flex items-center hover:text-[#7C0902] shrink-0"
      >
        <FaHome className="mr-1" /> Home
      </Link>

      <FaChevronRight className="mx-2 text-gray-400 shrink-0" />

      {/* Current Page */}
      <span className="text-gray-500 truncate max-w-[50%] sm:max-w-none">
        {propertyTitle}
      </span>

      <button
        onClick={() => navigate(-1)}
        className="ml-auto text-[#7C0902] text-xs underline hover:text-[#600601] shrink-0"
      >
        ← Go Back
      </button>
    </nav>
  );
}
