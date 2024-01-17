import {
  CollectionReference,
  DocumentData,
  QueryFieldFilterConstraint,
  WhereFilterOp,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  where
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { firestoreDB } from "../../config/firebaseConfig";
import { IListFinalItem, IListItem } from "../../types/globalTypes";
import { moveItemOverType } from "../../utilities/functions";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import classes from "./NewCurrentFilm.module.css";

type NewCurrentFilmProps = {
  currentFilmsLength: number;
  onCloseModal: () => void;
  onAddFilm: moveItemOverType;
  uid: string;
};

function NewCurrentFilm({
  currentFilmsLength,
  onCloseModal,
  onAddFilm,
  uid,
}: NewCurrentFilmProps) {
  const [filmSuggestion, setFilmSuggestion] = useState<IListFinalItem | null>(
    null
  );
  const { t } = useTranslation();
  const querryArgs: [
    CollectionReference<DocumentData, DocumentData>,
    QueryFieldFilterConstraint,
    QueryFieldFilterConstraint
  ] = [
    collection(firestoreDB, "items"),
    where("sublist", "==", "backlogList"),
    where("author", "==", uid),
  ];

  function randomQuerryConstructor(
    randomID: string,
    comparison: WhereFilterOp
  ) {
    return query(
      ...querryArgs,
      where("__name__", comparison, randomID),
      orderBy("__name__", "asc"),
      limit(1)
    );
  }

  async function snapshoptHandler(
    ref: ReturnType<typeof randomQuerryConstructor>
  ) {
    const snapshot = await getDocs(ref);
    if (snapshot.empty) return false;

    const data = snapshot.docs[0].data();    
    setFilmSuggestion({...data as IListItem, id: snapshot.docs[0].id});
    return true;
  }

  const findRandomFilm = useCallback(async () => {
    let autoID = doc(collection(firestoreDB, "items")).id;

    let findRandomItemRes = await snapshoptHandler(
      randomQuerryConstructor(autoID, ">=")
    );

    if (!findRandomItemRes) {
      findRandomItemRes = await snapshoptHandler(
        randomQuerryConstructor(autoID, "<=")
      );
      if (!findRandomItemRes) {
        // TODO - add error handling
        return;
      }
    }
  }, [firestoreDB]);

  useEffect(() => {
    if (currentFilmsLength <= 4) {
      findRandomFilm();
    }
  }, [findRandomFilm, currentFilmsLength]);

  if (currentFilmsLength > 4) {
    return (
      <Modal onClick={onCloseModal}>
        <h2 className={classes.title}>{t("newCurrentFilm.enough")}</h2>
        <div className={classes.buttons}>
          <Button onClick={onCloseModal}>{t("techActions.close")}</Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClick={onCloseModal}>
      <h2 className={classes.title}>
        {filmSuggestion === null ? "Nothing" : filmSuggestion.title}
      </h2>

      {filmSuggestion !== null && (
        <div className={classes.buttons}>
          <Button onClick={findRandomFilm}>
            {t("newCurrentFilm.another")}
          </Button>
          <Button onClick={() => {onAddFilm("currentList", filmSuggestion); onCloseModal()}}>
            {t("newCurrentFilm.chooseThis")}
          </Button>
        </div>
      )}
    </Modal>
  );
}

export default NewCurrentFilm;
