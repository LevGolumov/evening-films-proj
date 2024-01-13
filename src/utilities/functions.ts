import {
  DocumentData,
  Query,
  deleteDoc,
  doc,
  getCountFromServer,
  updateDoc
} from "firebase/firestore";
import { firestoreDB } from "../config/firebaseConfig";
import { IListFinalItem, ISublist, listNameType } from "../types/globalTypes";

export async function moveItemOver(
  newListName: listNameType,
  data: IListFinalItem
) {
  const listUpd: ISublist = {
    sublist: newListName,
    updatedAt: new Date().getTime(),
  };
  return updateDoc(doc(firestoreDB, "items", data.id), { ...listUpd });
}
export type moveItemOverType = typeof moveItemOver;

export async function deleteItem(dataId: string) {
  return deleteDoc(doc(firestoreDB, "items", dataId));
}

export const listItemsCount = async (
  querry: Query<DocumentData, DocumentData>
) =>
  getCountFromServer(querry).then((data) => {
    return data.data().count;
  });
