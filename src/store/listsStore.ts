import { configureStore, createSlice } from "@reduxjs/toolkit";
import { listNameType, IListItem } from "../types/functionTypes";

interface IItemsState {
  backlogList: { list: IListItem[]; isFetched: boolean };
  doneList: { list: IListItem[]; isFetched: boolean };
  currentList: { list: IListItem[]; isFetched: boolean };
}

const itemsInitialState: IItemsState = {
  backlogList: { list: [], isFetched: false },
  doneList: { list: [], isFetched: false },
  currentList: { list: [], isFetched: false },
};

const filmsSlice = createSlice({
  name: "items",
  initialState: itemsInitialState,
  reducers: {
    addFilm(state, action: { payload: { list: listNameType; item: IListItem } }) {
      state[action.payload.list].list = state[action.payload.list].list.concat(
        action.payload.item
      );
    },
    removeFilm(state, action: { payload: { list: listNameType; removedItem: IListItem } }) {
      state[action.payload.list].list = state[action.payload.list].list.filter(
        (item) => item.id !== action.payload.removedItem.id
      );
    },
    setList(state, action: { payload: { list: listNameType; items: IListItem[] } }) {
      state[action.payload.list].list = [...action.payload.items];
      state[action.payload.list].isFetched = true;
    },
    logout(state) {
      return (state = { ...itemsInitialState });
    },
  },
});

const store = configureStore({
  reducer: { items: filmsSlice.reducer },
});

export const itemsActions = filmsSlice.actions;

export default store;
