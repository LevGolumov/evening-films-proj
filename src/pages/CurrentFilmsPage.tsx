import ListComponent from "../components/ListComponent/ListComponent";
import { Fragment, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import useHttp from "../hooks/use-http";
import { itemsActions } from "../store/listsStore";
import NewCurrentFilm from "../components/currentList/NewCurrentFilm";
import { useEffect } from "react";
import { AuthContext } from "../components/context/auth-context";
import { useTranslation } from "react-i18next";

function CurrentFilmsPage() {
  const dispatch = useDispatch();
  const currentList = useSelector((state) => state.items.currentList.list);
  const backlogList = useSelector((state) => state.items.backlogList.list);
  const authCtx = useContext(AuthContext)
  const uid = authCtx.uid
  const token = authCtx.token
  const areCurrentFilmsFetched = useSelector(
    (state) => state.items.currentList.isFetched
  );
  const areToWatchFilmsFetched = useSelector(
    (state) => state.items.backlogList.isFetched
  );
  const [popup, setPopup] = useState(false);

  const { isLoading, error, sendRequests: fetchFilms } = useHttp();
  const { sendRequests: removeFilm } = useHttp();
  const { sendRequests: submitFilm } = useHttp();

  useEffect(() => {
    const transformFilms = (listName, filmsObj) => {
      const loadedFilms = [];

      for (const filmKey in filmsObj) {
        loadedFilms.push({ id: filmKey, film: filmsObj[filmKey].film });
      }
      dispatch(itemsActions.setList({ list: listName, films: loadedFilms }));
    };

    function fetchLists(listName) {
      fetchFilms(
        {
          url: `${import.meta.env.VITE_DATABASE_URL}/lists/${uid}/default/${listName.toLowerCase()}.json?auth=${token}`,
        },
        transformFilms.bind(null, listName)
      );
    }

    if (!areToWatchFilmsFetched) {
      fetchLists("backlogList");
    } else if (!areCurrentFilmsFetched) {
      fetchLists("currentList");
    }
  }, [fetchFilms, dispatch, areToWatchFilmsFetched, areCurrentFilmsFetched, uid, token]);

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
      url: `${import.meta.env.VITE_DATABASE_URL}/lists/${uid}/default/${listName.toLowerCase()}/${
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
        url: `${import.meta.env.VITE_DATABASE_URL}/lists/${uid}/default/${listName.toLowerCase()}.json?auth=${token}`,
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
  const {t} = useTranslation()
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

export default CurrentFilmsPage;
