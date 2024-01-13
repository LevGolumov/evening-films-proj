import {
  CollectionReference,
  DocumentData,
  QueryFieldFilterConstraint,
  QueryOrderByConstraint,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {
  ChangeEvent,
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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
import { IListFinalItem } from "../types/globalTypes";
import { deleteItem, listItemsCount } from "../utilities/functions";

function DoneListPage() {
  const dispatch = useDispatch();

  const authCtx = useContext(AuthContext);
  const uid = authCtx.uid;
  const doneList = useStoreSelector((state) => state.items.doneList.list);
  const [queueSearch, setQueueSearch] = useState("");
  const [foundAmount, setFoundAmount] = useState(0);
  const [itemsCount, setItemsCount] = useState(0);
  const { isLoading, error } = useHttp();
  const {
    currentPage,
    sliceTheList,
    setCurrentPage,
    pageNumbers,
    calcPageAmount,
  } = usePaginate();

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

  const doneListQuerry = query(...querryArgs);

  useEffect(() => {
    listItemsCount(doneListQuerry).then((res) => setItemsCount(res));
  }, []);

  useEffect(() => {
    calcPageAmount(itemsCount);
  }, [itemsCount]);

  useEffect(() => {
    const unsub = onSnapshot(doneListQuerry, (snapshot) => {
      const items: IListFinalItem[] = [];
      snapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          title: doc.data().title,
          createdAt: doc.data().createdAt,
          author: doc.data().author,
          list: doc.data().list,
          sublist: doc.data().sublist,
          ...(doc.data().comment && { comment: doc.data().comment }),
          ...(doc.data().rating && { rating: doc.data().rating }),
          ...(doc.data().updatedAt && { updatedAt: doc.data().updatedAt }),
        });
      });
      dispatch(itemsActions.setList({ list: "doneList", items }));
    });

    return () => unsub();
  }, []);

  const sortedFilms = useMemo(() => {
    if (queueSearch === "") {
      setFoundAmount(0);
      return [...doneList];
    }

    const sorted = [...doneList].filter((item) =>
      item.title.toLowerCase().includes(queueSearch.toLowerCase())
    );
    setFoundAmount([...sorted].length);
    return sorted;
  }, [doneList, queueSearch]);

  function handleQueueSearch(event: ChangeEvent<HTMLInputElement>) {
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
        header={`${t("pages.watchedList.header")}: ${doneList.length ?? 0}`}
        found={`${t("pages.toWatchList.found")}: ${foundAmount}`}
        isSearched={!!foundAmount}
        nothingInList={t("pages.watchedList.nothingInList")}
        loading={isLoading}
        error={error}
        listName="doneList"
        items={slicedList}
        removeItemHandler={(id) => {
          deleteItem(id);
          setItemsCount((prev) => prev - 1);
        }}
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

export default DoneListPage;
