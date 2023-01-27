import ListComponent from "../components/ListComponent/ListComponent";
import { Fragment, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import useHttp from "../hooks/use-http";
import { filmsActions } from "../store/filmsStore";
import NewCurrentFilm from "../components/CurrentFilms/NewCurrentFilm";
import { useEffect } from "react";
import { AuthContext } from "../components/context/auth-context";

function CurrentFilmsPage() {
  const dispatch = useDispatch();
  const currentFilms = useSelector((state) => state.films.currentFilms.list);
  const toWatchFilms = useSelector((state) => state.films.toWatchFilms.list);
  const authCtx = useContext(AuthContext)
  const uid = authCtx.uid
  const token = authCtx.token
  const areCurrentFilmsFetched = useSelector(
    (state) => state.films.currentFilms.isFetched
  );
  const areToWatchFilmsFetched = useSelector(
    (state) => state.films.toWatchFilms.isFetched
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
      dispatch(filmsActions.loadList({ list: listName, films: loadedFilms }));
    };

    function fetchLists(listName) {
      fetchFilms(
        {
          url: `${process.env.REACT_APP_DATABASE_URL}/lists/${uid}/default/${listName.toLowerCase()}.json?auth=${token}`,
        },
        transformFilms.bind(null, listName)
      );
    }

    if (!areToWatchFilmsFetched) {
      fetchLists("toWatchFilms");
    } else if (!areCurrentFilmsFetched) {
      fetchLists("currentFilms");
    }
  }, [fetchFilms, dispatch, areToWatchFilmsFetched, areCurrentFilmsFetched, uid, token]);

  function filmAddHandler(listName, film) {
    dispatch(filmsActions.addFilm({ list: listName, film: film }));
  }

  function createFilm(filmText, listName, data) {
    const generatedId = data.name; // firebase-specific => "name" contains generated id
    const createdFilm = { id: generatedId, film: filmText };

    filmAddHandler(listName, createdFilm);
  }

  async function removeFilmHandler(listName, data) {
    removeFilm({
      url: `${process.env.REACT_APP_DATABASE_URL}/lists/${uid}/default/${listName.toLowerCase()}/${
        data.id
      }.json?auth=${token}`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(filmsActions.removeFilm({ list: listName, removedFilm: data }));
  }
  function postFilmHandler(listName, filmText) {
    submitFilm(
      {
        url: `${process.env.REACT_APP_DATABASE_URL}/lists/${uid}/default/${listName.toLowerCase()}.json?auth=${token}`,
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
    moveFilmOver.bind(null, "toWatchFilms", "currentFilms");
  }
  function addFilmToCurrentsHandler(data) {
    removeFilmHandler("toWatchFilms", data);
    postFilmHandler("currentFilms", data.film);
    closeModalHanler();
  }

  return (
    <Fragment>
      {popup && (
        <NewCurrentFilm
          onCloseModal={closeModalHanler}
          onChooseFilm={chooseCurrentFilmHandler}
          toWatchFilms={toWatchFilms}
          onAddFilm={addFilmToCurrentsHandler}
          currentFilmsLength={currentFilms.length}
        />
      )}
      <ListComponent
        header="Текущие фильмы"
        loading={isLoading}
        error={error}
        items={currentFilms}
        onNewFilmRequest={openModalHanler}
        removeFilmHandler={removeFilmHandler.bind(null, "currentFilms")}
        toWatched={moveFilmOver.bind(null, "currentFilms", "watchedFilms")}
        toWatchFilmsList={toWatchFilms}
        listName="CurrentFilms"
      />
    </Fragment>
  );
}

export default CurrentFilmsPage;
