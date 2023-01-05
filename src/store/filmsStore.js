import { configureStore, createSlice } from '@reduxjs/toolkit'

const filmsInitialState = {unwatchedFilms: [], watchedFilms: [], currentFilms: []}

const filmsSlice = createSlice({
    name: 'films',
    initialState: filmsInitialState,
    reducers: {
        addFilm (state, action) {
            state[action.payload.list] = state[action.payload.list].concat(action.payload.film)
        },
        removeFilm (state, action) {
            state[action.payload.list] = state[action.payload.list].filter((item) => item.id !== action.payload.removedFilm.id)
        },
        loadList (state, action) {
            state[action.payload.list] = [...action.payload.films]
        }
    }
})

const store = configureStore({
    reducer: {films: filmsSlice.reducer}
})

export const filmsActions = filmsSlice.actions;

export default store