export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const maxPageButtons = 5; // Show up to 5 pages
  let pages = [];

  if (totalPages <= maxPageButtons) {
    pages = [...Array(totalPages).keys()].map((i) => i + 1);
  } else {
    // Many pages: show first, last, current ±1, with ellipsis
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    pages = [1];
    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center mt-8 gap-5 py-3">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-6 py-2 text-black rounded ${
          currentPage === 1 ? "bg-gray-200" : "bg-white border"
        }`}
      >
        Prev
      </button>
      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={idx} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-2 py-1 text-black rounded ${
              currentPage === p ? "bg-[#7C0902] text-white" : "bg-white border"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-6 py-2 text-black rounded ${
          currentPage === totalPages ? "bg-gray-200" : "bg-white border"
        }`}
      >
        Next
      </button>
    </div>
  );
}
