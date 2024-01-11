import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ListComponent from "../components/ListComponent/ListComponent";
import NewFilm from "../components/NewFilm/NewFilm";
import Pagination from "../components/Pagination/Pagination";
import Search from "../components/Search/Search";
import { AuthContext } from "../components/context/auth-context";
import { firestoreDB } from "../config/firebaseConfig";
import useHttp from "../hooks/use-http";
import usePaginate from "../hooks/use-paginate";
import { itemsActions } from "../store/listsStore";
import { IListItem, ListAndTitleFunction } from "../types/functionTypes";

function ToWatchFilmsPage() {
  const dispatch = useDispatch();
  const backlogList = useSelector((state) => state.items.backlogList.list);
  const [queueSearch, setQueueSearch] = useState("");
  const [foundAmount, setFoundAmount] = useState(0);
  const authCtx = useContext(AuthContext);
  const [pageNumbers, setPageNumbers] = useState(0);
  const [itemsCount, setItemsCount] = useState(0);
  const { isLoading, error } = useHttp();
  const { currentPage, sliceTheList, setCurrentPage } = usePaginate();
  const uid = authCtx.uid;

  const backlogListQuerry = query(
    collection(firestoreDB, "lists", uid, "default"),
    where("type", "==", "backlogList")
  );

  useEffect(() => {
    getCountFromServer(backlogListQuerry).then((data) => {
      setItemsCount(data.data().count);
    });
  }, []);

  useEffect(() => {
    setPageNumbers(Math.ceil(itemsCount / 10));
  }, [itemsCount]);

  useEffect(() => {
    const unsub = onSnapshot(backlogListQuerry, (snapshot) => {
      const items: IListItem[] = [];
      snapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          item: doc.data().item,
          createdAt: doc.data().createdAt,
        });
      });
      dispatch(itemsActions.setList({ list: "backlogList", items }));
    });

    return () => unsub();
  }, []);

  async function removeFilmHandler(dataId: string) {
    await deleteDoc(doc(firestoreDB, "lists", uid, "default", dataId));
    setItemsCount((prev) => prev - 1);
  }

  const postFilmHandler: ListAndTitleFunction = (listName, filmText) => {
    addDoc(collection(firestoreDB, "lists", uid, "default"), {
      item: filmText,
      type: listName,
      createdAt: new Date().getTime(),
    });
    setItemsCount((prev) => prev + 1);
  };

  function moveFilmOver(prevListName, newListName, data) {
    // removeFilmHandler(prevListName, data);
    // postFilmHandler(newListName, data.film);
  }

  function handleQueueSearch(event) {
    setQueueSearch(event.target.value);
  }

  const sortedFilms = useMemo(() => {
    if (queueSearch === "") {
      setFoundAmount(0);
      return [...backlogList].sort((a, b) => b.createdAt - a.createdAt);
    }
    const sorted = [...backlogList].filter((item) =>
      item.item.toLowerCase().includes(queueSearch.toLowerCase())
    );
    setFoundAmount([...sorted].length);
    return sorted;
  }, [backlogList, queueSearch]);

  const slicedList = useMemo(
    () => sliceTheList(sortedFilms),
    [sliceTheList, sortedFilms]
  );

  const { t } = useTranslation();

  return (
    <Fragment>
      <NewFilm onAddFilm={postFilmHandler} />
      <Search value={queueSearch} onChange={handleQueueSearch} />
      <ListComponent
        header={`${t("pages.toWatchList.amount")}: ${itemsCount}`}
        found={`${t("pages.toWatchList.found")}: ${foundAmount}`}
        isSearched={!!foundAmount}
        loading={isLoading}
        error={error}
        nothingInList={t("pages.toWatchList.empty")}
        items={slicedList}
        listName="backlogList"
        removeFilmHandler={removeFilmHandler}
        toWatched={moveFilmOver.bind(null, "backlogList", "doneList")}
        toCurrent={moveFilmOver.bind(null, "backlogList", "currentList")}
      />
      {pageNumbers > 1 && (
        <Pagination
          pageNumbers={pageNumbers}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </Fragment>
  );
}

export default ToWatchFilmsPage;
