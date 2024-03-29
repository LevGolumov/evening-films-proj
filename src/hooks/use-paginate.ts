import { useState, useCallback } from "react";

function usePaginate() {
  const linesPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState<number>(1);

  const calcPageAmount = useCallback((itemsCount: number )=> {    
    setPageNumbers(Math.ceil(itemsCount / linesPerPage));
  }
  , [linesPerPage]);

  const clearPages = useCallback(() => {
    setCurrentPage(1);
    setPageNumbers(1);
  }, []);

  const sliceTheList = useCallback((list: any[]) => {
    const lastListIndex = currentPage * linesPerPage;
    const firstListIndex = lastListIndex - linesPerPage;
    
    return [...list].slice(firstListIndex, lastListIndex);
  }, [currentPage]);

  return { currentPage, sliceTheList, setCurrentPage, pageNumbers, calcPageAmount, clearPages };
}

export default usePaginate;
