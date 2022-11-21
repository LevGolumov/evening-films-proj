import Modal from "../UI/Modal";
import { useState, useEffect, useCallback } from "react";
import Button from "../UI/Button";
import classes from "./NewCurrentFilm.module.css";

function NewCurrentFilm(props) {
  const [filmSuggestion, setFilmSuggestion] = useState(null);
  const findRandomFilm = useCallback(() => {
    const randomFilmItem =
      props.films[Math.floor(Math.random() * props.films.length)];
    setFilmSuggestion(randomFilmItem);
  }, [props.films]);

  useEffect(() => findRandomFilm(), [findRandomFilm]);
  return (
    <Modal onClick={props.onCloseModal}>
      <h2 className={classes.title}>
        {filmSuggestion === null ? "Nothing" : filmSuggestion.film}
      </h2>
      <div className={classes.buttons}>
        <Button onClick={findRandomFilm}>Другой вариант</Button>
        <Button onClick={props.onAddFilm.bind(null, filmSuggestion)}>
          Смотреть этот
        </Button>
      </div>
    </Modal>
  );
}

export default NewCurrentFilm;
