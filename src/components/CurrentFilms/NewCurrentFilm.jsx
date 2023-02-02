import Modal from "../UI/Modal";
import { useState, useEffect, useCallback } from "react";
import Button from "../UI/Button";
import classes from "./NewCurrentFilm.module.css";
import { useTranslation } from "react-i18next";

function NewCurrentFilm(props) {
  const [filmSuggestion, setFilmSuggestion] = useState(null);
  const findRandomFilm = useCallback(() => {
    const randomFilmItem =
      props.toWatchFilms[Math.floor(Math.random() * props.toWatchFilms.length)];
    setFilmSuggestion(randomFilmItem);
  }, [props.toWatchFilms]);  
  const {t} = useTranslation()

  useEffect(() => {
    if (props.currentFilmsLength <= 4) {
      findRandomFilm()
    }
  }, [findRandomFilm, props.currentFilmsLength])
  
  if (props.currentFilmsLength > 4) {
    return <Modal onClick={props.onCloseModal}>
    <h2 className={classes.title}>
      {t("newCurrentFilm.enough")}
    </h2>
    <div className={classes.buttons}>
      <Button onClick={props.onCloseModal}>
        {t("techActions.close")}
      </Button>
    </div>
  </Modal>
  } 

  return (
    <Modal onClick={props.onCloseModal}>
      <h2 className={classes.title}>
        {filmSuggestion === null ? "Nothing" : filmSuggestion.film}
      </h2>
      <div className={classes.buttons}>
        <Button onClick={findRandomFilm}>{t("newCurrentFilm.another")}</Button>
        <Button onClick={props.onAddFilm.bind(null, filmSuggestion)}>
        {t("newCurrentFilm.chooseThis")}
        </Button>
      </div>
    </Modal>
  );
}

export default NewCurrentFilm;
