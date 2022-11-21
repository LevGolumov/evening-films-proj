import classes from './FilmItem.module.css';

const FilmItem = (props) => {
  return <li className={classes.task}>
  <div>
  {props.children}
  </div>
  <div className={classes.actions}>
  <button onClick={props.onRemove}>−</button>
  </div>
  </li>
};

export default FilmItem;