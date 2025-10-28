import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaChevronRight } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

export default function Breadcrumb({ breadcrumbItems = [] }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // breadcrumbItems should be an array of objects: { title: string, to?: string }
  // Example:
  // [
  //   { title: "Home", to: "/" },
  //   { title: "Category", to: "/category" },
  //   { title: "Property Name" }  // no 'to' means current page (non-clickable)
  // ]

  return (
    <nav className="max-w-6xl mx-auto flex items-center text-sm text-gray-600 mb-0 px-4 sm:px-6">
      {breadcrumbItems.map((item, index) => (
        <span
          key={index}
          className="flex items-center truncate max-w-[50%] sm:max-w-none"
        >
          {index > 0 && (
            <FaChevronRight className="mx-2 text-gray-400 shrink-0" />
          )}
          {item.to ? (
            <Link to={item.to} className="hover:text-[#7C0902] shrink-0">
              {item.title}
            </Link>
          ) : (
            <span className="text-gray-500">{item.title}</span>
          )}
        </span>
      ))}

      <button
        onClick={() => navigate(-1)}
        className="ml-auto text-[#7C0902] text-xs underline hover:text-[#600601] shrink-0"
      >
        ← Go Back
      </button>
    </nav>
  );
}
