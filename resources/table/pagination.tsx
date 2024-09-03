import React from "react";
import { useTranslation } from "react-i18next";
import { IconType } from "react-icons";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  totalLabel?: string;
  pageLabel?: string;
  ofLabel?: string;
}

interface PaginationButtonProps {
  Icon: IconType;
  onClick?: () => void;
  disabled?: boolean;
}

const PaginationButton: React.FC<PaginationButtonProps> = ({
  Icon,
  onClick,
  disabled,
}) => {
  return (
    <button
      onClick={() => onClick && onClick()}
      disabled={disabled}
      className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
    >
      <Icon />
    </button>
  );
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  onPageChange,
  totalLabel,
  pageLabel,
  ofLabel,
}) => {
  const { t } = useTranslation();
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
    <div
      className="flex justify-between items-center mt-4 text-gray-500"
      style={{ marginTop: "1vh" }}
    >
      <div>
        <span style={{ fontSize: "1.75vh" }}>
          {totalLabel || t("common.total-records")} {totalRecords},{" "}
          {pageLabel || t("common.total-page")} {currentPage}{" "}
          {ofLabel || t("common.of")} {totalPages}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <PaginationButton
          Icon={FaChevronLeft}
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage <= 1}
        />
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded ${page === currentPage ? "bg-teal-400 text-white" : "bg-gray-200"
              }`}
          >
            {page}
          </button>
        ))}
        <PaginationButton
          Icon={FaChevronRight}
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages < 1}
        />
      </div>
    </div>
  );
};

export default Pagination;
