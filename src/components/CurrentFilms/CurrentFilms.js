import Button from '../UI/Button';
import Section from '../UI/Section';
import FilmItem from '../Films/FilmItem';
import classes from '../Films/Films.module.css';

function CurrentFilms(props) {
    let filmList = <h2>В очереди ничего нет!<br /> <Button onClick={props.onNewFilmRequest}>Выбери новый фильм</Button></h2>;

  if (props.items.length > 0) {
    filmList = (
      <div>
      <ul>
        {props.items.map((film) => (
          <FilmItem key={film.id} onRemove={props.removeCurrentFilm.bind(null, film.id)}>{film.film}</FilmItem>
        ))}
      </ul>
      {!!props.unwatchedFilmsList.length && <Button onClick={props.onNewFilmRequest}>Выбрать ещё</Button>}
      </div>
    );
  }

  if (props.unwatchedFilmsList.length === 0 && props.items.length === 0) {
    filmList = <h2>Нет фильмов на просмотр! <br /> Сначала добавь что-то!</h2>;
  }

  let content = filmList;

  if (props.error) {
    content = <button onClick={props.onFetch}>Try again</button>;
  }

  if (props.loading) {
    content = 'Loading films...';
  }

  return (
    <Section>    
      <div className={classes.container}>
      <p>Текущие фильмы</p>
      {content}
      </div>
    </Section>
  );
    
}

export default CurrentFilms;