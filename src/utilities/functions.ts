import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { firestoreDB } from "../config/firebaseConfig";
import { IListFinalItem, ISublist, listNameType } from "../types/functionTypes";


export async function moveItemOver(newListName: listNameType, data: IListFinalItem) {
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