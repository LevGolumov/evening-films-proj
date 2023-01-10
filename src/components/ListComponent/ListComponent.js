import Section from "../UI/Section";
import ListItem from "./ListItem";
import classes from "./ListComponent.module.css";
import Button from "../UI/Button";

const ListComponent = (props) => {
  let filmList;
  let isUnwatchedList;
  let content;
  
  if (props.toWatchFilmsList !== undefined) {
    isUnwatchedList = !!props.toWatchFilmsList.length;
    filmList = (
      <h2>
        В очереди ничего нет!
        <br />{" "}
        <Button onClick={props.onNewFilmRequest}>Выбери новый фильм</Button>
      </h2>
    );
  } else {
    isUnwatchedList = false;
    filmList = <h2>{props.nothingInList}</h2>;
  }

  if (props.items.length > 0) {
    let reverseFilmList;
    if (!isUnwatchedList) {
      reverseFilmList = [...props.items].reverse();
    } else {
      reverseFilmList = [...props.items];
    }
    filmList = (
      <div>
        <h2>{props.header}</h2>
        <ul>
          {props.listName === "toWatchFilms"
            ? reverseFilmList.map((item) => (
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

            reverseFilmList.map((item) => (
              <ListItem
                key={item.id}
                listName={props.listName}
                toWatched={props.toWatched.bind(null, item)}
                onRemove={props.removeFilmHandler.bind(null, item)}
              >
                {item.film}
              </ListItem>
            ))
            
            : reverseFilmList.map((item) => (
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
          <Button onClick={props.onNewFilmRequest}>Выбрать ещё</Button>
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
        Нет фильмов на просмотр! <br /> Сначала добавь что-то!
      </h2>
    );
  }

  content = filmList;

  if (props.loading) {
    content = "Загружаем фильмы...";
  }

  if (props.error) {
    content = <button onClick={props.onFetch}>Try again</button>;
  }

  return (
    <Section>
      <div className={classes.container}>{content}</div>
    </Section>
  );
};

export default ListComponent;
