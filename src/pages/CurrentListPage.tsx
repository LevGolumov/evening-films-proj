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
import { IListItem } from "../types/functionTypes";

function CurrentListPage() {
  const dispatch = useDispatch();
  const currentList = useStoreSelector((state) => state.items.currentList.list);
  const backlogList = useStoreSelector((state) => state.items.backlogList.list);
  const authCtx = useContext(AuthContext);
  const uid = authCtx.uid;
  const token = authCtx.token;  
  const [popup, setPopup] = useState(false);

  const { isLoading, error, sendRequests: fetchFilms } = useHttp();
  const { sendRequests: removeFilm } = useHttp();
  const { sendRequests: submitFilm } = useHttp();

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

  const currentListQuerry = query(...querryArgs)

  useEffect(() => {
    const unsub = onSnapshot(currentListQuerry, (snapshot) => {
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
      dispatch(itemsActions.setList({ list: "currentList", items }));
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

  //   if (!areToWatchFilmsFetched) {
  //     fetchLists("backlogList");
  //   } else if (!areCurrentFilmsFetched) {
  //     fetchLists("currentList");
  //   }
  // }, [
  //   fetchFilms,
  //   dispatch,
  //   areToWatchFilmsFetched,
  //   areCurrentFilmsFetched,
  //   uid,
  //   token,
  // ]);

  function filmAddHandler(listName, film) {
    dispatch(itemsActions.addFilm({ list: listName, film: film }));
  }

  function createFilm(filmText, listName, data) {
    const generatedId = data.name; // firebase-specific => "name" contains generated id
    const createdFilm = { id: generatedId, film: filmText };

    filmAddHandler(listName, createdFilm);
  }

  async function removeFilmHandler(listName, data) {
    removeFilm({
      url: `${
        import.meta.env.VITE_DATABASE_URL
      }/lists/${uid}/default/${listName.toLowerCase()}/${
        data.id
      }.json?auth=${token}`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(itemsActions.removeFilm({ list: listName, removedFilm: data }));
  }
  function postFilmHandler(listName, filmText) {
    submitFilm(
      {
        url: `${
          import.meta.env.VITE_DATABASE_URL
        }/lists/${uid}/default/${listName.toLowerCase()}.json?auth=${token}`,
        method: "POST",
        body: { film: filmText },
        headers: {
          "Content-Type": "application/json",
        },
      },
      createFilm.bind(null, filmText, listName)
    );
  }

  function moveFilmOver(prevListName, newListName, data) {
    removeFilmHandler(prevListName, data);
    postFilmHandler(newListName, data.film);
  }

  function openModalHanler() {
    setPopup(true);
  }
  function closeModalHanler() {
    setPopup(false);
  }
  function chooseCurrentFilmHandler(film) {
    moveFilmOver.bind(null, "backlogList", "currentList");
  }
  function addFilmToCurrentsHandler(data) {
    removeFilmHandler("backlogList", data);
    postFilmHandler("currentList", data.film);
    closeModalHanler();
  }
  const { t } = useTranslation();
  return (
    <Fragment>
      {popup && (
        <NewCurrentFilm
          onCloseModal={closeModalHanler}
          onChooseFilm={chooseCurrentFilmHandler}
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
        onNewFilmRequest={openModalHanler}
        removeFilmHandler={removeFilmHandler.bind(null, "currentList")}
        toWatched={moveFilmOver.bind(null, "currentList", "doneList")}
        toWatchFilmsList={backlogList}
        listName="currentList"
      />
    </Fragment>
  );
}

export default CurrentListPage;
