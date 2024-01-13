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
import { Fragment, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import NewCurrentFilm from "../components/CurrentFilms/NewCurrentFilm";
import ListComponent from "../components/ListComponent/ListComponent";
import { AuthContext } from "../components/context/auth-context";
import { firestoreDB } from "../config/firebaseConfig";
import { useStoreSelector } from "../hooks/reduxHooks";
import useHttp from "../hooks/use-http";
import { itemsActions } from "../store/itemsStore";
import { IListFinalItem } from "../types/globalTypes";
import { deleteItem, moveItemOver } from "../utilities/functions";

function CurrentListPage() {
  const dispatch = useDispatch();
  const currentList = useStoreSelector((state) => state.items.currentList.list);
  const backlogList = useStoreSelector((state) => state.items.backlogList.list);
  const authCtx = useContext(AuthContext);
  const uid = authCtx.uid;
  const [popup, setPopup] = useState(false);

  const { isLoading, error } = useHttp();

  const querryArgs: [
    CollectionReference<DocumentData, DocumentData>,
    QueryOrderByConstraint,
    QueryFieldFilterConstraint,
    QueryFieldFilterConstraint
  ] = [
    collection(firestoreDB, "items"),
    orderBy("updatedAt", "desc"),
    where("sublist", "==", "currentList"),
    where("author", "==", uid),
  ];

  const currentListQuerry = query(...querryArgs);

  useEffect(() => {
    const unsub = onSnapshot(currentListQuerry, (snapshot) => {
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
      dispatch(itemsActions.setList({ list: "currentList", items }));
    });

    return () => unsub();
  }, []);
  
  function openModalHanler() {
    setPopup(true);
  }
  function closeModalHanler() {
    setPopup(false);
  }
  function addFilmToCurrentsHandler(data: IListFinalItem) {
    moveItemOver("currentList", data)
    closeModalHanler();
  }
  const { t } = useTranslation();
  return (
    <Fragment>
      {popup && (
        <NewCurrentFilm
          onCloseModal={closeModalHanler}
          onChooseFilm={moveItemOver}
          backlogList={backlogList}
          onAddFilm={addFilmToCurrentsHandler}
          currentFilmsLength={currentList.length}
        />
      )}
      <ListComponent
        header={t("pages.currentList.header")}
        loading={isLoading}
        error={error}
        items={currentList}
        onNewItemRequest={openModalHanler}
        removeItemHandler={deleteItem}
        listName="currentList"
        moveItemOver={moveItemOver}
      />
    </Fragment>
  );
}

export default CurrentListPage;
