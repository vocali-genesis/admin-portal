import React from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, totalRecords, onPageChange }) => {
  const maxPageNumbersToShow = 5; // Maximum number of page numbers to show at once
  const halfMax = Math.floor(maxPageNumbersToShow / 2);
  let startPage = Math.max(1, currentPage - halfMax);
  let endPage = Math.min(totalPages, currentPage + halfMax);

  if (endPage - startPage + 1 < maxPageNumbersToShow) {
    if (startPage === 1) {
      endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
    }
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-between items-center mt-4 text-gray-500">
      <div>
        Total Records: {totalRecords}, Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          <FaChevronLeft />
        </button>
        {pageNumbers.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded ${page === currentPage ? 'bg-teal-400 text-white' : 'bg-gray-200'}`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
