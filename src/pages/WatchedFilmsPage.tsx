import { CollectionReference, DocumentData, QueryFieldFilterConstraint, QueryOrderByConstraint, collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import ListComponent from "../components/ListComponent/ListComponent";
import Pagination from "../components/Pagination/Pagination";
import Search from "../components/Search/Search";
import { AuthContext } from "../components/context/auth-context";
import { firestoreDB } from "../config/firebaseConfig";
import { useStoreSelector } from "../hooks/reduxHooks";
import useHttp from "../hooks/use-http";
import usePaginate from "../hooks/use-paginate";
import { itemsActions } from "../store/itemsStore";
import { IListItem } from "../types/functionTypes";

function WatchedFilmsPage() {
  const dispatch = useDispatch();

  const authCtx = useContext(AuthContext);
  const uid = authCtx.uid;
  const token = authCtx.token;

  const doneList = useStoreSelector((state) => state.items.doneList.list);
  
  const [queueSearch, setQueueSearch] = useState("");
  const [foundAmount, setFoundAmount] = useState(0);
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

  

  async function removeFilmHandler(listName, data) {    
    dispatch(itemsActions.removeFilm({ list: listName, removedItem: data }));
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
