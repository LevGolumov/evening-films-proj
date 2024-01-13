import React, { Dispatch, SetStateAction } from "react";

export default function Pagination({
  setCurrentPage,
  currentPage,
  pageNumbers,
}: {
  setCurrentPage: Dispatch<SetStateAction<number>>;
  currentPage: number;
  pageNumbers: number;
}) {
  function handlePageSelection(page: number) {
    setCurrentPage(page);
  }
  let pages = [];
  for (let i = 1; i <= pageNumbers; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => handlePageSelection(i)}
        className={
          i === Number(currentPage)
            ? "pagination__btn pagination__btn--active"
            : "pagination__btn"
        }
      >
        {i}
      </button>
    );
  }

  // if (currentPage < 0 || isNaN(Number(currentPage)) || (pageNumbers.length < currentPage && pageNumbers.length !== 0) ) {
  //   history('../table/1')
  // }

  return <div className="pagination container">{pages}</div>;
}
