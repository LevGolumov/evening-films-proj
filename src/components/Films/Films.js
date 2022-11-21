import Section from '../UI/Section';
import FilmItem from './FilmItem';
import classes from './Films.module.css';

const Films = (props) => {
  let filmList = <h2>Фильмы не найдены. Пора их добавить!</h2>;

  if (props.items.length > 0) {
    const reverseFilmList = [...props.items].reverse()
    filmList = (
      <div>
      <p>Всего фильмов {props.items.length}</p>
      <ul>
        {reverseFilmList.map((item) => (
          <FilmItem key={item.id} onRemove={props.removeFilmHandler.bind(null, item.id)}>{item.film}</FilmItem>
        ))}
      </ul>
      </div>
    );
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
      <div className={classes.container}>{content}</div>
    </Section>
  );
};

export default Films;
