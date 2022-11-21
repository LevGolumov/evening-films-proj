import { Fragment, useState, useEffect } from "react";
import Films from "../components/Films/Films";
import CurrentFilms from "../components/CurrentFilms/CurrentFilms";
import NewFilm from "../components/NewFilm/NewFilm";
import useHttp from "../hooks/use-http";
import NewCurrentFilm from "../components/CurrentFilms/NewCurrentFilm";

function FilmPage() {
  const [films, setFilms] = useState([]);
  const [currentFilms, setCurrentFilms] = useState([]);
  const [popup, setPopup] = useState(false);

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
  const { sendRequests: removeFilm } = useHttp();
  const { sendRequests: submitCurrentFilm } = useHttp();

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
  }, [fetchFilms, fetchCurrentFilms]);

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

  async function removeFilmHandler(id) {
    removeFilm({
      url: `https://evening-films-default-rtdb.europe-west1.firebasedatabase.app/unwatchedfilms/${id}.json`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    setFilms((prevFilms) => prevFilms.filter((item) => item.id !== id));
  }

  const createFilm = (filmText, data) => {
    const generatedId = data.name; // firebase-specific => "name" contains generated id
    const createdFilm = { id: generatedId, film: filmText };

    setCurrentFilms((prevFilms) => prevFilms.concat(createdFilm));
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
      createFilm.bind(null, filmText)
    );
  }

  function addFilmToCurrentsHandler(data) {
    removeFilmHandler(data.id);
    submitCurrentFilmHandler(data.film);
    closeModalHanler()
  }

  function removeCurrentFilm(id){
    removeFilm({
      url: `https://evening-films-default-rtdb.europe-west1.firebasedatabase.app/currentfilms/${id}.json`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    setCurrentFilms((prevFilms) => prevFilms.filter((item) => item.id !== id));
  }

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
      <CurrentFilms
        items={currentFilms}
        loading={loadingCurrent}
        error={errorCurrent}
        onFetch={fetchCurrentFilms}
        onNewFilmRequest={openModalHanler}
        removeCurrentFilm={removeCurrentFilm}
        unwatchedFilmsList={films}
      />
      <Films
        items={films}
        loading={loadingUnwatched}
        error={errorUnwatched}
        onFetch={fetchFilms}
        removeFilmHandler={removeFilmHandler}
      />
    </Fragment>
  );
}

export default FilmPage;
