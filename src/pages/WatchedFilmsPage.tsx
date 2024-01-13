import ListComponent from "../components/ListComponent/ListComponent";
import Search from "../components/Search/Search";
import { useSelector, useDispatch } from "react-redux";
import { itemsActions } from "../store/itemsStore";
import useHttp from "../hooks/use-http";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../components/context/auth-context";
import { useTranslation } from "react-i18next";
import Pagination from "../components/Pagination/Pagination";
import usePaginate from "../hooks/use-paginate";
import { CollectionReference, DocumentData, QueryOrderByConstraint, QueryFieldFilterConstraint, collection, orderBy, where, query, onSnapshot } from "firebase/firestore";
import { firestoreDB } from "../config/firebaseConfig";
import { IListItem } from "../types/functionTypes";

function WatchedFilmsPage() {
  const dispatch = useDispatch();

  const authCtx = useContext(AuthContext);
  const uid = authCtx.uid;
  const token = authCtx.token;

  const doneList = useSelector((state) => state.items.doneList.list);
  const areFilmsFetched = useSelector(
    (state) => state.items.doneList.isFetched
  );
  const [queueSearch, setQueueSearch] = useState("");
  const [foundAmount, setFoundAmount] = useState(0);
  const { sendRequests: removeFilm } = useHttp();
  const { isLoading, error, sendRequests: fetchFilms } = useHttp();
  const { currentPage, sliceTheList, setCurrentPage, pageNumbers } =
    usePaginate();

    const querryArgs: [
      CollectionReference<DocumentData, DocumentData>,
      QueryOrderByConstraint,
      QueryFieldFilterConstraint,
      QueryFieldFilterConstraint
    ] = [
      collection(firestoreDB, "items"),
      orderBy("updatedAt", "desc"),
      where("sublist", "==", "doneList"),
      where("author", "==", uid),
    ];
  
    const doneListQuerry = query(...querryArgs)
  
    useEffect(() => {
      const unsub = onSnapshot(doneListQuerry, (snapshot) => {
        const items: IListItem[] = [];
        snapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            title: doc.data().title,
            createdAt: doc.data().createdAt,
            author: doc.data().author,
            list: doc.data().list,
            sublist: doc.data().sublist,
            ...doc.data().comment && { comment: doc.data().comment },
            ...doc.data().rating && { rating: doc.data().rating },
            ...doc.data().updatedAt && { updatedAt: doc.data().updatedAt },
          });
        });
        dispatch(itemsActions.setList({ list: "doneList", items }));
      });
  
      return () => unsub();
    }, []);

  // useEffect(() => {
  //   const transformFilms = (listName, filmsObj) => {
  //     const loadedFilms = [];

  //     for (const filmKey in filmsObj) {
  //       loadedFilms.push({ id: filmKey, film: filmsObj[filmKey].film });
  //     }
  //     dispatch(itemsActions.setList({ list: listName, films: loadedFilms }));
  //   };

  //   function fetchLists(listName) {
  //     fetchFilms(
  //       {
  //         url: `${
  //           import.meta.env.VITE_DATABASE_URL
  //         }/lists/${uid}/default/${listName.toLowerCase()}.json?auth=${token}`,
  //       },
  //       transformFilms.bind(null, listName)
  //     );
  //   }
  //   if (!areFilmsFetched) {
  //     fetchLists("doneList");
  //   }
  // }, [fetchFilms, dispatch, areFilmsFetched, uid, token]);

  async function removeFilmHandler(listName, data) {
    // removeFilm({
    //   url: `${
    //     import.meta.env.VITE_DATABASE_URL
    //   }/lists/${uid}/default/${listName.toLowerCase()}/${
    //     data.id
    //   }.json?auth=${token}`,
    //   method: "DELETE",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    dispatch(itemsActions.removeFilm({ list: listName, removedFilm: data }));
  }

  const sortedFilms = useMemo(() => {
    if (queueSearch === "") {
      setFoundAmount(0);
      return [...doneList];
    }

    const sorted = [...doneList].filter((item) =>
      item.item.toLowerCase().includes(queueSearch.toLowerCase())
    );
    setFoundAmount([...sorted].length);
    return sorted;
  }, [doneList, queueSearch]);

  function handleQueueSearch(event) {
    setQueueSearch(event.target.value);
  }

  const { t } = useTranslation();
  const slicedList = useMemo(
    () => sliceTheList(sortedFilms),
    [sliceTheList, sortedFilms]
  );

  return (
    <Fragment>
      <Search value={queueSearch} onChange={handleQueueSearch} />
      <ListComponent
        found={`${t("pages.toWatchList.found")}: ${foundAmount}`}
        isSearched={!!foundAmount}
        nothingInList={t("pages.watchedList.nothingInList")}
        loading={isLoading}
        error={error}
        header={`${t("pages.watchedList.header")}: ${doneList.length ?? 0}`}
        listName="doneList"
        items={slicedList}
        removeFilmHandler={removeFilmHandler.bind(null, "doneList")}
      />
      {pageNumbers.length > 1 && (
        <Pagination
          pageNumbers={pageNumbers}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </Fragment>
  );
}

export default WatchedFilmsPage;
