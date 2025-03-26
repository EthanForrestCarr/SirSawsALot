import React from 'react';
import "../../styles/Button.css";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  paginate,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null; // Hide pagination if there's only one page

  return (
    <div className="pagination-container">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => paginate(i + 1)}
          className={`btn-pagination ${currentPage === i + 1 ? 'active' : ''}`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
