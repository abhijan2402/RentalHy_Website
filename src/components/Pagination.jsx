import { GrNext, GrPrevious } from "react-icons/gr";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const maxPageButtons = 5;
  let pages = [];

  // Clamp currentPage to valid range
  currentPage = Math.max(1, Math.min(currentPage, totalPages));

  if (totalPages <= maxPageButtons) {
    // Show all pages if few pages
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    // Always show first, last, with current ±1, ellipsis if needed
    pages.push(1);

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-5 py-3">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-6 py-2 text-[#7C0902] rounded ${
          currentPage === 1 ? "bg-gray-200" : "bg-white border"
        }`}
      >
        <GrPrevious />
      </button>
      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-2 py-1 text-[14px] text-black rounded ${
              currentPage === p ? "bg-[#7C0902] text-white" : "bg-white border"
            }`}
            disabled={currentPage === p}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-6 py-2 text-[#7C0902] rounded ${
          currentPage === totalPages ? "bg-gray-200" : "bg-white border"
        }`}
      >
        <GrNext />
      </button>
    </div>
  );
}
