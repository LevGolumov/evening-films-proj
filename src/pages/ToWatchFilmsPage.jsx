import { Fragment, useState, useEffect, useMemo, useContext } from "react";
import ListComponent from "../components/ListComponent/ListComponent";
import NewFilm from "../components/NewFilm/NewFilm";
import useHttp from "../hooks/use-http";
// import NewCurrentFilm from "../components/CurrentFilms/NewCurrentFilm";
import Search from "../components/Search/Search";
import { useSelector, useDispatch } from "react-redux";
import { filmsActions } from "../store/filmsStore";
import { AuthContext } from "../components/context/auth-context";

function ToWatchFilmsPage() {
  const dispatch = useDispatch();
  const toWatchFilms = useSelector((state) => state.films.toWatchFilms.list);
  const areToWatchFilmsFetched = useSelector(
    (state) => state.films.toWatchFilms.isFetched
  );
  const [queueSearch, setQueueSearch] = useState("");
  const authCtx = useContext(AuthContext)
  const uid = authCtx.uid
  const token = authCtx.token

  const {isLoading, error, sendRequests: fetchFilms } = useHttp();
  const { sendRequests: removeFilm } = useHttp();
  const { sendRequests: submitFilm } = useHttp();

  useEffect(() => {
    const transformFilms = (listName, filmsObj) => {
      console.log("In towatch useeffect")
      const loadedFilms = [];

      for (const filmKey in filmsObj) {
        loadedFilms.push({ id: filmKey, film: filmsObj[filmKey].film });
      }
      dispatch(filmsActions.loadList({ list: listName, films: loadedFilms }));
    };

    function fetchLists(listName) {
      fetchFilms(
        {
          url: `${process.env.REACT_APP_DATABASE_URL}/lists/${uid}/${listName.toLowerCase()}.json?auth=${token}`,
        },
        transformFilms.bind(null, listName)
      );
    }
    if (!areToWatchFilmsFetched) {
      fetchLists("toWatchFilms");
    }
  }, [fetchFilms, dispatch, areToWatchFilmsFetched, uid, token]);

  async function removeFilmHandler(listName, data) {
    removeFilm({
      url: `${process.env.REACT_APP_DATABASE_URL}/lists/${uid}/${listName.toLowerCase()}/${
        data.id
      }.json?auth=${token}`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(filmsActions.removeFilm({ list: listName, removedFilm: data }));
  }

  function filmAddHandler(listName, film) {
    dispatch(filmsActions.addFilm({ list: listName, film: film }));
  }

  function createFilm(filmText, listName, data) {
    const generatedId = data.name; // firebase-specific => "name" contains generated id
    const createdFilm = { id: generatedId, film: filmText };

    filmAddHandler(listName, createdFilm);
  }

  function postFilmHandler(listName, filmText) {
    submitFilm(
      {
        url: `${process.env.REACT_APP_DATABASE_URL}/lists/${uid}/${listName.toLowerCase()}.json?auth=${token}`,
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
    console.log('I\'m in')
    removeFilmHandler(prevListName, data);
    postFilmHandler(newListName, data.film)
  }

  function handleQueueSearch(event) {
    setQueueSearch(event.target.value);
  }

  const sortedFilms = useMemo(() => {
    if (queueSearch === "") {
      return toWatchFilms;
    }
    return [...toWatchFilms].filter((film) =>
      film.film.toLowerCase().includes(queueSearch.toLowerCase())
    );
  }, [toWatchFilms, queueSearch]);

  return (
    <Fragment>
      <NewFilm onAddFilm={filmAddHandler.bind(null, "toWatchFilms")} />
      <Search value={queueSearch} onChange={handleQueueSearch} />
      <ListComponent
        header={`Всего фильмов: ${toWatchFilms.length}`}
        loading={isLoading}
        error={error}
        nothingInList="Фильмы не найдены. Пора их добавить!"
        items={sortedFilms}
        listName="toWatchFilms"
        removeFilmHandler={removeFilmHandler.bind(null, "toWatchFilms")}
        toWatched={moveFilmOver.bind(null, "toWatchFilms", "watchedFilms")}
        toCurrent={moveFilmOver.bind(null, "toWatchFilms", "currentFilms")}
      />
    </Fragment>
  );
}

export default ToWatchFilmsPage;
