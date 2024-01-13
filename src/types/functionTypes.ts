export interface IListAndTitle {
  listName: listNameType;
  filmText: string;
}
export type ListAndTitleFunction = (listName: listNameType, filmText: string) => void;

export type listNameType = "currentList" | "doneList" | "backlogList"

export interface ISublist {
  sublist: listNameType;
  updatedAt?: number;
}

export interface IListItem extends ISublist {
  id: string;
  author: string;
  comment?: string;
  list: string; //id of the parent list in lists collection
  rating?: number;
  sublist: listNameType;
  title: string;
  createdAt: number;
}