import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) {
        return null;
    }

    const pageNumbers = [];
    // Logic to show a limited number of page links (e.g., first, last, current, and neighbors)
    // For simplicity, we'll show a compact version here.
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            if (currentPage > 2) pages.push(currentPage - 1);
            if (currentPage > 1 && currentPage < totalPages) pages.push(currentPage);
            if (currentPage < totalPages - 1) pages.push(currentPage + 1);
            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return [...new Set(pages)]; // Remove duplicates
    }

    return (
        <div className="flex justify-center items-center gap-2 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md bg-white dark:bg-gray-800 disabled:opacity-50"
            >
                &laquo; Prev
            </button>
            {getPageNumbers().map((page, index) =>
                typeof page === 'string' ? (
                    <span key={`ellipsis-${index}`} className="px-3 py-1">...</span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1 border rounded-md ${currentPage === page ? 'bg-green-600 text-white border-green-600' : 'bg-white dark:bg-gray-800'}`}
                    >
                        {page}
                    </button>
                )
            )}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-md bg-white dark:bg-gray-800 disabled:opacity-50"
            >
                Next &raquo;
            </button>
        </div>
    );
};

export default Pagination;
