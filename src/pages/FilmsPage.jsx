import { Fragment, useState, useEffect, useMemo } from "react";
import ListComponent from "../components/ListComponent/ListComponent";
import NewFilm from "../components/NewFilm/NewFilm";
import useHttp from "../hooks/use-http";
import NewCurrentFilm from "../components/CurrentFilms/NewCurrentFilm";
import Search from "../components/Search/Search";
import { useSelector, useDispatch } from "react-redux";
import { filmsActions } from "../store/filmsStore";

function FilmsPage() {
  const dispatch = useDispatch();
  const unwatchedFilms = useSelector((state) => state.films.unwatchedFilms);
  const watchedFilms = useSelector((state) => state.films.watchedFilms);
  const currentFilms = useSelector((state) => state.films.currentFilms);
  const [popup, setPopup] = useState(false);
  const [queueSearch, setQueueSearch] = useState("");

  const { sendRequests: fetchFilms } = useHttp();
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
          url: `https://evening-films-default-rtdb.europe-west1.firebasedatabase.app/${listName.toLowerCase()}.json`,
        },
        transformFilms.bind(null, listName)
      );
    }
    fetchLists("currentFilms");
    fetchLists("watchedFilms");
    fetchLists("unwatchedFilms");
  }, [fetchFilms, dispatch]);

  async function removeFilmHandler(listName, data) {
    removeFilm({
      url: `https://evening-films-default-rtdb.europe-west1.firebasedatabase.app/${listName.toLowerCase()}/${data.id}.json`,
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

  function openModalHanler() {
    setPopup(true);
  }

  function closeModalHanler() {
    setPopup(false);
  }

  function chooseCurrentFilmHandler(film) {
    moveFilmOver.bind(null, "unwatchedFilms", "currentFilms")
  }

  function createFilm(filmText, listName, data) {
    const generatedId = data.name; // firebase-specific => "name" contains generated id
    const createdFilm = { id: generatedId, film: filmText };

    filmAddHandler(listName, createdFilm);
  }

  function postFilmHandler(listName, filmText) {
    submitFilm(
      {
        url: `https://evening-films-default-rtdb.europe-west1.firebasedatabase.app/${listName.toLowerCase()}.json`,
        method: "POST",
        body: { film: filmText },
        headers: {
          "Content-Type": "application/json",
        },
      },
      createFilm.bind(null, filmText, listName)
    );
  }

  function addFilmToCurrentsHandler(data) {
    removeFilmHandler("unwatchedFilms", data);
    postFilmHandler("currentFilms", data.film);
    closeModalHanler();
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
      return unwatchedFilms;
    }
    return [...unwatchedFilms].filter((film) =>
      film.film.toLowerCase().includes(queueSearch.toLowerCase())
    );
  }, [unwatchedFilms, queueSearch]);

  return (
    <Fragment>
      {popup && (
        <NewCurrentFilm
          onCloseModal={closeModalHanler}
          onChooseFilm={chooseCurrentFilmHandler}
          films={unwatchedFilms}
          onAddFilm={addFilmToCurrentsHandler}
        />
      )}
      <NewFilm onAddFilm={filmAddHandler.bind(null, "unwatchedFilms")} />
      <ListComponent
        header="Текущие фильмы"
        items={currentFilms}
        onNewFilmRequest={openModalHanler}
        removeFilmHandler={moveFilmOver.bind(
          null,
          "currentFilms",
          "watchedFilms"
        )}
        unwatchedFilmsList={unwatchedFilms}
        listName="currentFilms"
      />
      <ListComponent
        nothingInList="Вы не посмотрели ни одного фильма!"
        header="Просмотренные фильмы"
        listName="watchedFilms"
        items={watchedFilms}
        removeFilmHandler={removeFilmHandler.bind(null, "watchedFilms")}
      />
      <Search value={queueSearch} onChange={handleQueueSearch} />
      <ListComponent
        header={`Всего фильмов: ${unwatchedFilms.length}`}
        nothingInList="Фильмы не найдены. Пора их добавить!"
        items={sortedFilms}
        listName="unwatchedFilms"
        removeFilmHandler={removeFilmHandler.bind(null, "unwatchedFilms")}
        toWatched={moveFilmOver.bind(null, "unwatchedFilms", "watchedFilms")}
        toCurrent={moveFilmOver.bind(null, "unwatchedFilms", "currentFilms")}
      />
    </Fragment>
  );
}

export default FilmsPage;
