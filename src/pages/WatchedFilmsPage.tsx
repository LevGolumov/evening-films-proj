import ListComponent from "../components/ListComponent/ListComponent";
import Search from "../components/Search/Search";
import { useSelector, useDispatch } from "react-redux";
import { filmsActions } from "../store/filmsStore";
import useHttp from "../hooks/use-http";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../components/context/auth-context";
import { useTranslation } from "react-i18next";
import Pagination from "../components/Pagination/Pagination";
import usePaginate from "../hooks/use-paginate";

function WatchedFilmsPage() {
  const dispatch = useDispatch();

  const authCtx = useContext(AuthContext);
  const uid = authCtx.uid;
  const token = authCtx.token;

  const watchedFilms = useSelector((state) => state.films.watchedFilms.list);
  const areFilmsFetched = useSelector(
    (state) => state.films.watchedFilms.isFetched
  );
  const [queueSearch, setQueueSearch] = useState("");
  const [foundAmount, setFoundAmount] = useState(0);
  const { sendRequests: removeFilm } = useHttp();
  const { isLoading, error, sendRequests: fetchFilms } = useHttp();
  const {currentPage, sliceTheList, setCurrentPage, pageNumbers} = usePaginate();

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
          url: `${
            import.meta.env.VITE_DATABASE_URL
          }/lists/${uid}/default/${listName.toLowerCase()}.json?auth=${token}`,
        },
        transformFilms.bind(null, listName)
      );
    }
    if (!areFilmsFetched) {
      fetchLists("watchedFilms");
    }
  }, [fetchFilms, dispatch, areFilmsFetched, uid, token]);

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
    dispatch(filmsActions.removeFilm({ list: listName, removedFilm: data }));
  }

  const sortedFilms = useMemo(() => {
    if (queueSearch === "") {
      setFoundAmount(0);
      return [...watchedFilms].reverse();
    }

    const sorted = [...watchedFilms].filter((film) =>
      film.film.toLowerCase().includes(queueSearch.toLowerCase())
    );
    setFoundAmount([...sorted].length);
    return sorted;
  }, [watchedFilms, queueSearch]);

  function handleQueueSearch(event) {
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
        found={`${t("pages.toWatchList.found")}: ${foundAmount}`}
        isSearched={!!foundAmount}
        nothingInList={t("pages.watchedList.nothingInList")}
        loading={isLoading}
        error={error}
        header={`${t("pages.watchedList.header")}: ${watchedFilms.length ?? 0}`}
        listName="watchedFilms"
        items={slicedList}
        removeFilmHandler={removeFilmHandler.bind(null, "watchedFilms")}
      />
      {pageNumbers.length > 1 && (
        <Pagination
          pageNumbers={pageNumbers}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </Fragment>
  );
}

export default WatchedFilmsPage;
