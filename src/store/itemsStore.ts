import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IListFinalItem, listNameType } from "../types/globalTypes";

type fetchedList = { list: IListFinalItem[]; isFetched: boolean };

const initialList: fetchedList = { list: [], isFetched: false };

const itemsInitialState = {
  parentList: "",
  backlogList: initialList,
  doneList: initialList,
  currentList: initialList,
};

const itemsSlice = createSlice({
  name: "items",
  initialState: itemsInitialState,
  reducers: {
    addItem(
      state,
      action: PayloadAction<{ list: listNameType; item: IListFinalItem }>
    ) {
      state[action.payload.list].list = state[action.payload.list].list.concat(
        action.payload.item
      );
    },
    removeItem(
      state,
      action: PayloadAction<{ list: listNameType; removedItem: IListFinalItem }>
    ) {
      state[action.payload.list].list = state[action.payload.list].list.filter(
        (item) => item.id !== action.payload.removedItem.id
      );
    },
    setList(
      state,
      action: PayloadAction<{ list: listNameType; items: IListFinalItem[] }>
    ) {
      state[action.payload.list].list = [...action.payload.items];
      state[action.payload.list].isFetched = true;
    },
    logout(state) {
      return (state = { ...itemsInitialState });
    },
    setParentList(state, action: PayloadAction<string>) {
      state.parentList = action.payload;
    },
  },
});

export const itemsActions = itemsSlice.actions;

export default itemsSlice.reducer;
