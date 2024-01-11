export interface IListAndTitle {
  listName: listNameType;
  filmText: string;
}
export type ListAndTitleFunction = (listName: string, filmText: string) => void;

export type listNameType = "currentList" | "doneList" | "backlogList"

export interface IListItem {
  id: string;
  item: string;
  createdAt: Date
}