import React from 'react';

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
    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => paginate(i + 1)}
          style={{
            margin: '0 5px',
            padding: '5px 10px',
            backgroundColor: currentPage === i + 1 ? '#007BFF' : '#f0f0f0',
            color: currentPage === i + 1 ? '#fff' : '#000',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
