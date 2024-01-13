export interface IListAndTitle {
  listName: listNameType;
  filmText: string;
}
export type ListAndTitleFunction = (
  listName: listNameType,
  filmText: string
) => void;

export type listNameType = "currentList" | "doneList" | "backlogList";

export interface ISublist {
  sublist: listNameType;
  updatedAt?: number;
}

interface ID {
  id: string;
}

export interface IListItem extends ISublist {
  author: string;
  comment?: string;
  list: string; //id of the parent list in lists collection
  rating?: number;
  sublist: listNameType;
  title: string;
  createdAt: number;
}

export interface IListFinalItem extends IListItem, ID {}

export interface IParentList {
  allowedUsers?: string[];
  author: string;
  createdAt: number;
  favorite: boolean;
  title: string;
}

export interface IParentListWithId extends IParentList, ID {}
