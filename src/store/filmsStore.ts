import { configureStore, createSlice } from "@reduxjs/toolkit";

const filmsInitialState = {
  toWatchFilms: { list: [], isFetched: false },
  watchedFilms: { list: [], isFetched: false },
  currentFilms: { list: [], isFetched: false },
};

const filmsSlice = createSlice({
  name: "films",
  initialState: filmsInitialState,
  reducers: {
    addFilm(state, action) {
      state[action.payload.list].list = state[action.payload.list].list.concat(
        action.payload.film
      );
    },
    removeFilm(state, action) {
      state[action.payload.list].list = state[action.payload.list].list.filter(
        (item) => item.id !== action.payload.removedFilm.id
      );
    },
    loadList(state, action) {
      state[action.payload.list].list = [...action.payload.films];
      state[action.payload.list].isFetched = true;
    },
    logout(state){
      return state = {...filmsInitialState}
    }
  },
});

const store = configureStore({
  reducer: { films: filmsSlice.reducer },
});

export const filmsActions = filmsSlice.actions;

export default store;
