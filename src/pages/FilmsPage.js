import { Fragment, useState, useEffect, useMemo } from "react";
import ListComponent from "../components/ListComponent/ListComponent";
import NewFilm from "../components/NewFilm/NewFilm";
import useHttp from "../hooks/use-http";
import NewCurrentFilm from "../components/CurrentFilms/NewCurrentFilm";
import Search from "../components/Search/Search";

function FilmPage() {
  const [films, setFilms] = useState([]);
  const [currentFilms, setCurrentFilms] = useState([]);
  const [watchedFilms, setWatchedFilms] = useState([]);
  const [popup, setPopup] = useState(false);
  const [queueSearch, setQueueSearch] = useState("");

  const {
    isLoading: loadingUnwatched,
    error: errorUnwatched,
    sendRequests: fetchFilms,
  } = useHttp();
  const {
    isLoading: loadingCurrent,
    error: errorCurrent,
    sendRequests: fetchCurrentFilms,
  } = useHttp();
  const {
    isLoading: loadingWatched,
    error: errorWatched,
    sendRequests: fetchWatchedFilms,
  } = useHttp();
  const { sendRequests: removeFilm } = useHttp();
  const { sendRequests: submitCurrentFilm } = useHttp();
  const { sendRequests: submitWatchedFilm } = useHttp();

  useEffect(() => {
    const transformFilms = (setFilms, filmsObj) => {
      const loadedFilms = [];

      for (const filmKey in filmsObj) {
        loadedFilms.push({ id: filmKey, film: filmsObj[filmKey].film });
      }

      setFilms(loadedFilms);
    };

    fetchFilms(
      {
        url: "https://evening-films-default-rtdb.europe-west1.firebasedatabase.app/unwatchedfilms.json",
      },
      transformFilms.bind(null, setFilms)
    );
    fetchCurrentFilms(
      {
        url: "https://evening-films-default-rtdb.europe-west1.firebasedatabase.app/currentfilms.json",
      },
      transformFilms.bind(null, setCurrentFilms)
    );
    fetchWatchedFilms(
      {
        url: "https://evening-films-default-rtdb.europe-west1.firebasedatabase.app/watchedfilms.json",
      },
      transformFilms.bind(null, setWatchedFilms)
    );
  }, [fetchFilms, fetchCurrentFilms,fetchWatchedFilms]);

  const filmAddHandler = (film) => {
    setFilms((prevFilms) => prevFilms.concat(film));
  };

  function openModalHanler() {
    setPopup(true);
  }

  function closeModalHanler() {
    setPopup(false);
  }

  function chooseFilmHandler(film) {
    setCurrentFilms((prevState) => prevState.concat(film));
  }

  async function removeFilmHandler(data) {
    removeFilm({
      url: `https://evening-films-default-rtdb.europe-west1.firebasedatabase.app/unwatchedfilms/${data.id}.json`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    setFilms((prevFilms) => prevFilms.filter((item) => item.id !== data.id));
  }
  async function removeWatchedFilmHandler(data) {
    removeFilm({
      url: `https://evening-films-default-rtdb.europe-west1.firebasedatabase.app/watchedfilms/${data.id}.json`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    setWatchedFilms((prevFilms) => prevFilms.filter((item) => item.id !== data.id));
  }

  const createFilm = (filmText, updateFunction, data) => {
    const generatedId = data.name; // firebase-specific => "name" contains generated id
    const createdFilm = { id: generatedId, film: filmText };

    updateFunction((prevFilms) => prevFilms.concat(createdFilm));
  };

  function submitCurrentFilmHandler(filmText) {
    submitCurrentFilm(
      {
        url: "https://evening-films-default-rtdb.europe-west1.firebasedatabase.app/currentfilms.json",
        method: "POST",
        body: { film: filmText },
        headers: {
          "Content-Type": "application/json",
        },
      },
      createFilm.bind(null, filmText, setCurrentFilms)
    );
  }

  function submitWatchedFilmHandler(filmText) {
    submitWatchedFilm(
      {
        url: "https://evening-films-default-rtdb.europe-west1.firebasedatabase.app/watchedfilms.json",
        method: "POST",
        body: { film: filmText },
        headers: {
          "Content-Type": "application/json",
        },
      },
      createFilm.bind(null, filmText, setWatchedFilms)
    );
  } 

  function addFilmToCurrentsHandler(data) {
    removeFilmHandler(data);
    submitCurrentFilmHandler(data.film);
    closeModalHanler();
  }

  function addFilmToWatchedsHandler(data){
    removeCurrentFilm(data.id)
    submitWatchedFilmHandler(data.film)
  }

  function removeCurrentFilm(id) {
    removeFilm({
      url: `https://evening-films-default-rtdb.europe-west1.firebasedatabase.app/currentfilms/${id}.json`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    setCurrentFilms((prevFilms) => prevFilms.filter((item) => item.id !== id));
  }

  function handleQueueSearch(event) {
    setQueueSearch(event.target.value);
  }

  const sortedFilms = useMemo(() => {
    if (queueSearch === "") {
      return films;
    }
    return [...films].filter((film) =>
      film.film.toLowerCase().includes(queueSearch.toLowerCase())
    );
  }, [films, queueSearch]);

  return (
    <Fragment>
      {popup && (
        <NewCurrentFilm
          onCloseModal={closeModalHanler}
          onChooseFilm={chooseFilmHandler}
          films={films}
          onAddFilm={addFilmToCurrentsHandler}
        />
      )}
      <NewFilm onAddFilm={filmAddHandler} />
      <ListComponent
        header='Текущие фильмы'
        items={currentFilms}
        loading={loadingCurrent}
        error={errorCurrent}
        onFetch={fetchCurrentFilms}
        onNewFilmRequest={openModalHanler}
        removeFilmHandler={addFilmToWatchedsHandler}
        unwatchedFilmsList={films}
      />
      <ListComponent
      nothingInList='Вы не посмотрели ни одного фильма!'
        header='Просмотренные фильмы'
        items={watchedFilms}
        loading={loadingWatched}
        error={errorWatched}
        onFetch={fetchWatchedFilms}
        removeFilmHandler={removeWatchedFilmHandler}
      />
      <Search value={queueSearch} onChange={handleQueueSearch} />
      <ListComponent
        header = {`Всего фильмов: ${films.length}`}
        nothingInList='Фильмы не найдены. Пора их добавить!'
        items={sortedFilms}
        loading={loadingUnwatched}
        error={errorUnwatched}
        onFetch={fetchFilms}
        removeFilmHandler={removeFilmHandler}
      />
    </Fragment>
  );
}

export default FilmPage;
