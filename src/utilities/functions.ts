import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { IListItem, ISublist, listNameType } from "../types/functionTypes";
import { firestoreDB } from "../config/firebaseConfig";


export async function moveItemOver(newListName: listNameType, data: IListItem) {
  const listUpd: ISublist = {
    sublist: newListName,
    updatedAt: new Date().getTime(),
  };
  return updateDoc(doc(firestoreDB, "items", data.id), { ...listUpd });
}
export type moveItemOverType = typeof moveItemOver;

export async function deleteItem(dataId: string){
    return deleteDoc(doc(firestoreDB, "items", dataId))
}