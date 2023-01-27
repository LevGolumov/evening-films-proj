import React from "react";
import classes from "./Pagination.module.css"

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
    <div className={`${classes.pagination} ${classes.container}`}>
      {pageNumbers.map((index) => {
        return (
          <button
          key={index}
          page={index}
          onClick={() => handlePageSelection(index)}
            className={index === Number(currentPage) ? `${classes.btn} ${classes.btn__active}` : classes.btn}            
          >
            {index}
          </button>
        );
      })}
    </div>
  );
}
