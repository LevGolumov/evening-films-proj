import React, {
  ChangeEvent,
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  IListFinalItem,
  IListItem,
  ListAndTitleFunction,
  listNameType,
} from "../types/globalTypes";
import {
  CollectionReference,
  DocumentData,
  QueryOrderByConstraint,
  QueryFieldFilterConstraint,
  collection,
  orderBy,
  where,
  query,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import ListComponent from "../components/ListComponent/ListComponent";
import NewFilm from "../components/NewFilm/NewFilm";
import Pagination from "../components/Pagination/Pagination";
import { AuthContext } from "../components/context/auth-context";
import { firestoreDB } from "../config/firebaseConfig";
import { useStoreSelector } from "../hooks/reduxHooks";
import useHttp from "../hooks/use-http";
import usePaginate from "../hooks/use-paginate";
import { itemsActions } from "../store/itemsStore";
import {
  listItemsCount,
  deleteItem,
  moveItemOver,
} from "../utilities/functions";
import Search from "../components/Search/Search";

type CommonListPageProps = {
  passedList: listNameType;
};

const CommonListPage: React.FC<CommonListPageProps> = ({ passedList }) => {
  const dispatch = useDispatch();  
  const { t } = useTranslation();
  const itemsList = useStoreSelector((state) => state.items[passedList].list);
  const [queueSearch, setQueueSearch] = useState("");
  const [foundAmount, setFoundAmount] = useState(0);
  const authCtx = useContext(AuthContext);
  const [itemsCount, setItemsCount] = useState(0);
  const { isLoading, error } = useHttp();
  const {
    currentPage,
    sliceTheList,
    setCurrentPage,
    pageNumbers,
    calcPageAmount,
  } = usePaginate();
  const uid = authCtx.uid;
  const querryArgs: [
    CollectionReference<DocumentData, DocumentData>,
    QueryOrderByConstraint,
    QueryFieldFilterConstraint,
    QueryFieldFilterConstraint
  ] = [
    collection(firestoreDB, "items"),
    orderBy("createdAt", "desc"),
    where("sublist", "==", passedList),
    where("author", "==", uid),
  ];

  const listQuerry = query(...querryArgs);

  useEffect(() => {
    if (passedList !== "currentList") {
      listItemsCount(listQuerry).then((res) => setItemsCount(res));
    }
  }, [passedList]);

  useEffect(() => {
    if (passedList !== "currentList") {
      calcPageAmount(itemsCount);
    }
  }, [itemsCount, passedList]);

  useEffect(() => {
    const unsub = onSnapshot(listQuerry, (snapshot) => {
      const items: IListFinalItem[] = [];
      snapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          title: doc.data().title,
          createdAt: doc.data().createdAt,
          author: doc.data().author,
          passedList: doc.data().passedList,
          sublist: doc.data().sublist,
          ...(doc.data().comment && { comment: doc.data().comment }),
          ...(doc.data().rating && { rating: doc.data().rating }),
          ...(doc.data().updatedAt && { updatedAt: doc.data().updatedAt }),
        });
      });
      dispatch(itemsActions.setList({ list: passedList, items }));
    });

    return () => unsub();
  }, [passedList]);

  async function removeItemHandler(dataId: string) {
    await deleteItem(dataId);
    if (passedList !== "currentList") setItemsCount((prev) => prev - 1);
  }

  const postFilmHandler: ListAndTitleFunction = (
    listName: listNameType,
    filmText
  ) => {
    const itemInfo: IListItem = {
      title: filmText,
      sublist: listName,
      createdAt: new Date().getTime(),
      author: uid,
      list: "default",
    };

    addDoc(collection(firestoreDB, "items"), itemInfo);
    if (passedList !== "currentList") setItemsCount((prev) => prev + 1);
  };

  const relistItem = async (
    newListName: listNameType,
    data: IListFinalItem
  ) => {
    await moveItemOver(newListName, data);
    if (passedList !== "currentList") setItemsCount((prev) => prev - 1);
  };

  async function handleQueueSearch(event: ChangeEvent<HTMLInputElement>) {
    setQueueSearch(event.target.value);
  }

  const sortedFilms = useMemo(() => {
    if (queueSearch === "") {
      setFoundAmount(0);
      return [...itemsList].sort((a, b) => b.createdAt - a.createdAt);
    }
    const sorted = [...itemsList].filter((item) =>
      item.title.toLowerCase().includes(queueSearch.toLowerCase())
    );
    setFoundAmount([...sorted].length);
    return sorted;
  }, [itemsList, queueSearch]);

  const slicedList: IListFinalItem[] = useMemo(
    () => sliceTheList(sortedFilms),
    [sliceTheList, sortedFilms]
  );

  const header = useMemo(() => {
    switch (passedList) {
      case "backlogList":
        return `${t("pages.toWatchList.amount")}: ${itemsCount}`;
      case "doneList":
        return `${t("pages.watchedList.header")}: ${itemsCount ?? 0}`;
      case "currentList":
        return t("pages.currentList.header");
      default:
        return "";
    }
  }, [passedList, t, itemsCount]);

  function getRandomItemHandler() {
  }

  return (
    <Fragment>
      {passedList === "backlogList" && <NewFilm onAddFilm={postFilmHandler} />}
      {passedList !== "currentList" && (
        <Search value={queueSearch} onChange={handleQueueSearch} />
      )}
      <ListComponent
        header={header}
        found={`${t("pages.toWatchList.found")}: ${foundAmount}`}
        isSearched={!!foundAmount}
        loading={isLoading}
        error={error}
        nothingInList={t("pages.toWatchList.empty")}
        items={slicedList}
        listName={passedList}
        removeItemHandler={removeItemHandler}
        moveItemOver={relistItem}
        onNewItemRequest={getRandomItemHandler}
      />
      {pageNumbers > 1 && passedList !== "currentList" && (
        <Pagination
          pageNumbers={pageNumbers}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </Fragment>
  );
};
export default CommonListPage;
