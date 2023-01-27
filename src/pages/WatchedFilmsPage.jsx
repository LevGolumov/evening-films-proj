import ListComponent from "../components/ListComponent/ListComponent";
import Search from "../components/Search/Search";
import { useSelector, useDispatch } from "react-redux";
import { filmsActions } from "../store/filmsStore";
import useHttp from "../hooks/use-http";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../components/context/auth-context";

function WatchedFilmsPage() {
  const dispatch = useDispatch();
  
  const authCtx = useContext(AuthContext)
  const uid = authCtx.uid
  const token = authCtx.token

  const watchedFilms = useSelector((state) => state.films.watchedFilms.list);
  const areFilmsFetched = useSelector((state) => state.films.watchedFilms.isFetched);
  const [queueSearch, setQueueSearch] = useState("");
  const { sendRequests: removeFilm } = useHttp();
  const { isLoading, error, sendRequests: fetchFilms } = useHttp();

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
    if (!areFilmsFetched){
      fetchLists("watchedFilms");
    }
  }, [fetchFilms, dispatch, areFilmsFetched, uid, token]);

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

  const sortedFilms = useMemo(() => {
    if (queueSearch === "") {
      return watchedFilms;
    }
    return [...watchedFilms].filter((film) =>
      film.film.toLowerCase().includes(queueSearch.toLowerCase())
    );
  }, [watchedFilms, queueSearch]);

  function handleQueueSearch(event) {
    setQueueSearch(event.target.value);
  }

  return (
    <Fragment>
      <Search value={queueSearch} onChange={handleQueueSearch} />
      <ListComponent
        nothingInList="Вы не посмотрели ни одного фильма!"
        loading={isLoading}
        error={error}
        header="Просмотренные фильмы"
        listName="watchedFilms"
        items={sortedFilms}
        removeFilmHandler={removeFilmHandler.bind(null, "watchedFilms")}
      />
    </Fragment>
  );
}

export default WatchedFilmsPage;
