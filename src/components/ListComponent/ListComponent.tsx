import Section from "../UI/Section";
import ListItem from "./ListItem";
import classes from "./ListComponent.module.css";
import Button from "../UI/Button";
import { useTranslation } from "react-i18next";

const ListComponent = (props) => {
  let filmList;
  let isUnwatchedList;
  let content;
  const {t} = useTranslation()
  
  if (props.toWatchFilmsList !== undefined) {
    isUnwatchedList = !!props.toWatchFilmsList.length;
    filmList = (
      <h2>
        {t("pages.currentList.empty.header")}
        <br />{" "}
        <Button onClick={props.onNewFilmRequest}>{t("pages.currentList.empty.btn")}</Button>
      </h2>
    );
  } else {
    isUnwatchedList = false;
    filmList = <h2>{props.nothingInList}</h2>;
  }

  if (props.items.length > 0) {
    // let reverseFilmList;
    // if (!isUnwatchedList) {
    //   reverseFilmList = [...props.items].reverse();
    // } else {
    //   reverseFilmList = [...props.items];
    // }
    filmList = (
      <div>
        <h2 className="list__header">{props.header}</h2>
        {props.isSearched && <h3>{props.found}</h3>}
        <ul>
          {props.listName === "toWatchFilms"
            ? props.items.map((item) => (
                <ListItem
                  key={item.id}
                  listName={props.listName}
                  toWatched={props.toWatched.bind(null, item)}
                  toCurrent={props.toCurrent.bind(null, item)}
                  onRemove={props.removeFilmHandler.bind(null, item)}
                >
                  {item.film}
                </ListItem>
              ))
            : props.listName === "CurrentFilms" ?

            props.items.map((item) => (
              <ListItem
                key={item.id}
                listName={props.listName}
                toWatched={props.toWatched.bind(null, item)}
                onRemove={props.removeFilmHandler.bind(null, item)}
              >
                {item.film}
              </ListItem>
            ))
            
            : props.items.map((item) => (
                <ListItem
                  key={item.id}
                  listName={props.listName}
                  onRemove={props.removeFilmHandler.bind(null, item)}
                >
                  {item.film}
                </ListItem>
              ))}
        </ul>
        {isUnwatchedList && (
          <Button onClick={props.onNewFilmRequest}>{t("pages.currentList.notEmpty.btn")}</Button>
        )}
      </div>
    );
  }

  if (
    props.toWatchFilmsList &&
    props.toWatchFilmsList.length === 0 &&
    props.items.length === 0 && !props.loading
  ) {
    filmList = (
      <h2>
        {t("pages.currentList.empty.nothingness.1")} <br /> {t("pages.currentList.empty.nothingness.2")}
      </h2>
    );
  }

  content = filmList;

  if (props.loading) {
    content = t("techActions.loading") + "...";
  }

  if (props.error) {
    content = <button className="button" onClick={props.onFetch}>{t("techActions.tryAgain")}</button>;
  }

  return (
    <Section>
      <div className={classes.container}>{content}</div>
    </Section>
  );
};

export default ListComponent;
