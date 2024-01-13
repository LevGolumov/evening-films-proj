import {
  CollectionReference,
  DocumentData,
  QueryFieldFilterConstraint,
  QueryOrderByConstraint,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where
} from "firebase/firestore";
import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import ListComponent from "../components/ListComponent/ListComponent";
import NewFilm from "../components/NewFilm/NewFilm";
import Pagination from "../components/Pagination/Pagination";
import Search from "../components/Search/Search";
import { AuthContext } from "../components/context/auth-context";
import { firestoreDB } from "../config/firebaseConfig";
import { useStoreSelector } from "../hooks/reduxHooks";
import useHttp from "../hooks/use-http";
import usePaginate from "../hooks/use-paginate";
import { itemsActions } from "../store/itemsStore";
import { IListItem, ISublist, ListAndTitleFunction, listNameType } from "../types/functionTypes";

function ToWatchFilmsPage() {
  const dispatch = useDispatch();
  const backlogList: IListItem[] = useStoreSelector((state) => state.items.backlogList.list);
  const [queueSearch, setQueueSearch] = useState("");
  const [foundAmount, setFoundAmount] = useState(0);
  const authCtx = useContext(AuthContext);
  const [pageNumbers, setPageNumbers] = useState(0);
  const [itemsCount, setItemsCount] = useState(0);
  const { isLoading, error } = useHttp();
  const { currentPage, sliceTheList, setCurrentPage } = usePaginate();
  const uid = authCtx.uid;
  const querryArgs: [
    CollectionReference<DocumentData, DocumentData>,
    QueryOrderByConstraint,
    QueryFieldFilterConstraint,
    QueryFieldFilterConstraint
  ] = [
    collection(firestoreDB, "items"),
    orderBy("createdAt", "desc"),
    where("sublist", "==", "backlogList"),
    where("author", "==", uid),
  ];

  const backlogListQuerry = query(...querryArgs);

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
      dispatch(itemsActions.setList({ list: "backlogList", items }));
    });

    return () => unsub();
  }, []);

  async function removeFilmHandler(dataId: string) {
    await deleteDoc(doc(firestoreDB, "items", dataId));
    setItemsCount((prev) => prev - 1);
  }

  const postFilmHandler: ListAndTitleFunction = (listName: listNameType, filmText) => {
    const itemInfo: IListItem = {
      title: filmText,
      sublist: listName,
      createdAt: new Date().getTime(),
      author: uid,
      list: 'default',
      id: "" // generate beforehand by firebase
    }

    addDoc(collection(firestoreDB, "items"), itemInfo );
    setItemsCount((prev) => prev + 1);
  };

  function moveFilmOver(newListName, data) {
    const listUpd: ISublist = {
      sublist: newListName,
      updatedAt: new Date().getTime(),
    }
    updateDoc(doc(firestoreDB, "items", data.id), listUpd);
    setItemsCount((prev) => prev - 1);
  }

  async function handleQueueSearch(event) {
    setQueueSearch(event.target.value);
  }

  const sortedFilms = useMemo(() => {
    if (queueSearch === "") {
      setFoundAmount(0);
      return [...backlogList].sort((a, b) => b.createdAt - a.createdAt);
    }
    const sorted = [...backlogList].filter((item) =>
      item.title.toLowerCase().includes(queueSearch.toLowerCase())
    );
    setFoundAmount([...sorted].length);
    return sorted;
  }, [backlogList, queueSearch]);

  const slicedList: IListItem[] = useMemo(
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
        toWatched={moveFilmOver.bind(null, "doneList")}
        toCurrent={moveFilmOver.bind(null, "currentList")}
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
