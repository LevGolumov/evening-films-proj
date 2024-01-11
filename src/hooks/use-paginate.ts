import { useState, useCallback } from "react";

function usePaginate() {
  const linesPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);

  const sliceTheList = useCallback((list: any[]) => {
    const lastListIndex = currentPage * linesPerPage;
    const firstListIndex = lastListIndex - linesPerPage;
    let pageNums: number[] = [];

    // calculating the amount of pages
    for (let i = 1; i <= Math.ceil(list.length / linesPerPage); i++) {
      pageNums.push(i);
    }
    setPageNumbers(pageNums);

    return [...list].slice(firstListIndex, lastListIndex);
  }, [currentPage]);

  return { currentPage, sliceTheList, setCurrentPage, pageNumbers };
}

export default usePaginate;
