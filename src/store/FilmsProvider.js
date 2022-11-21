import FilmsContext from "./films-context";
import { useReducer } from "react";
import useHttp from "../../hooks/use-http";

const defaultFilmsState = {
  items: [],
};

function filmsListReducer(state, action) {
  let updatedFilmList;
  
  if (action.type === "ADD_ITEM") {
    const existingFilm = state.items.findIndex(
      (item) => item.name === action.item.name
    );
    if (!existingFilm) {
      const createFilm = (filmName, data) => {
        const generatedId = data.name; // firebase-specific => "name" contains generated id
        const createdFilm = { id: generatedId, film: filmName };

        updatedFilmList = state.items.concat(createdFilm);
      };

      const { isLoading, error, sendRequests: submitFilm } = useHttp();

      const enterFilmHandler = async (filmName) => {
        submitFilm(
          {
            url: "https://evening-films-default-rtdb.europe-west1.firebasedatabase.app/unwatchedfilms.json",
            method: "POST",
            body: { film: filmName },
            headers: {
              "Content-Type": "application/json",
            },
          },
          createFilm.bind(null, filmName)
        );
        enterFilmHandler();
      };
    }
  }
  if (action.type === "REMOVE_ITEM") {
  }
  if (action.type === "LOAD_ITEMS") {
  }
}

function FilmsProvider(props) {
  const [filmsListState, dispatchFilmListAction] = useReducer(
    filmsListReducer,
    defaultFilmsState
  );

  function addFilmToListHandler(item) {
    dispatchFilmListAction({ type: "ADD_ITEM", item: item });
  }
  function removeFilmFromListHandler(id) {
    dispatchFilmListAction({ type: "REMOVE_ITEM", id: id });
  }
  function loadFilmsListHandler() {
    dispatchFilmListAction({ type: "LOAD_ITEMS" });
  }
  const filmContext = {
    items: filmsListState.items,
    addItem: addFilmToListHandler,
    removeItem: removeFilmFromListHandler,
    loadItems: loadFilmsListHandler,
  };

  return (
    <FilmsContext.Provider value={filmContext}>
      {props.children}
    </FilmsContext.Provider>
  );
}

export default FilmsProvider;
