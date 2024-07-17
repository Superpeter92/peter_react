import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";

export const Pagination: React.FC<{
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}> = ({ totalPages, currentPage, setCurrentPage }) => {
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const visiblePageNumbers = pageNumbers.slice(
    Math.max(0, currentPage - 2),
    currentPage + 1,
  );

  return (
    <div className="mt-6">
      <div className="flex items-center justify-center">
        <button
          onClick={() => handlePageChange(1)}
          className="mr-2 rounded-l-md bg-gray-200 px-3 py-2 text-gray-900 hover:bg-gray-300 disabled:opacity-30 disabled:hover:bg-gray-200"
          disabled={currentPage === 1}
        >
          <ChevronDoubleLeftIcon className="h-5 w-5" />
        </button>

        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="mr-2 bg-gray-200 px-3 py-2 text-gray-900 hover:bg-gray-300 disabled:opacity-30 disabled:hover:bg-gray-200"
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        <div className="flex space-x-2">
          {visiblePageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`${
                currentPage === pageNumber
                  ? "bg-purplue text-white"
                  : "bg-white text-gray-900 ring-1 ring-inset ring-gray-200 hover:bg-purplue hover:text-white hover:ring-0"
              } flex w-10 items-center justify-center px-4 py-2 text-sm font-medium`}
            >
              {pageNumber}
            </button>
          ))}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="ml-2 bg-gray-200 px-3 py-2 text-gray-900 hover:bg-gray-300 disabled:opacity-30 disabled:hover:bg-gray-200"
          disabled={currentPage === totalPages}
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>

        <button
          onClick={() => handlePageChange(totalPages)}
          className="ml-2 rounded-r-md bg-gray-200 px-3 py-2 text-gray-900 hover:bg-gray-300 disabled:opacity-30 disabled:hover:bg-gray-200"
          disabled={currentPage === totalPages}
        >
          <ChevronDoubleRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
