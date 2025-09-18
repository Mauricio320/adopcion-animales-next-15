"use client";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const onPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const onNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const onGoToPage = (page: number) => {
    onPageChange(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
  <div className="flex flex-col md:flex-row justify-center md:justify-end items-center gap-4 w-full px-2">
    {totalPages > 1 && (
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-2 w-full md:w-auto">
        <button
          onClick={onPreviousPage}
          disabled={currentPage === 1}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-full sm:w-auto min-w-[100px] ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:scale-105 cursor-pointer shadow-sm"
          }`}
        >
          <FaChevronLeft size={12} />
          <span className="hidden sm:inline">Anterior</span>
          <span className="sm:hidden">Ant.</span>
        </button>
        
        <div className="flex gap-1 justify-center items-center max-w-full overflow-x-auto px-2 py-1">
          {getPageNumbers().map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => onGoToPage(pageNumber)}
              className={`cursor-pointer w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                currentPage === pageNumber
                  ? "bg-emerald-700 text-white shadow-lg transform scale-105"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:scale-105 shadow-sm"
              }`}
            >
              {pageNumber}
            </button>
          ))}
        </div>
        
        <button
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-full sm:w-auto min-w-[100px] ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:scale-105 cursor-pointer shadow-sm"
          }`}
        >
          <span className="hidden sm:inline">Siguiente</span>
          <span className="sm:hidden">Sig.</span>
          <FaChevronRight size={12} />
        </button>
      </div>
    )}
  </div>
  );
};
