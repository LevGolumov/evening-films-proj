import React from "react";

export default function Pagination({
  setCurrentPage,
  currentPage,
  pageNumbers
}) {

  function handlePageSelection(page){
    setCurrentPage(page)
  }

  // if (currentPage < 0 || isNaN(Number(currentPage)) || (pageNumbers.length < currentPage && pageNumbers.length !== 0) ) {
  //   history('../table/1')
  // }

  return (
    <div className="pagination container">
      {pageNumbers.map((index) => {
        return (
          <button
          key={index}
          page={index}
          onClick={() => handlePageSelection(index)}
            className={index === Number(currentPage) ? "pagination__btn pagination__btn--active" : "pagination__btn"}            
          >
            {index}
          </button>
        );
      })}
    </div>
  );
}
