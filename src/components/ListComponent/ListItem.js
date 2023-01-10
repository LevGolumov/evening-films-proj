import classes from './ListItem.module.css';
import { Fragment } from 'react';

const ListItem = (props) => {
  return <li className={classes.task}>
  <div>
  {props.children}
  </div>
  <div className={classes.actions}>
    {props.listName === "toWatchFilms" &&
    <Fragment>
    <button onClick={props.toWatched} title='Добавить в просмотренные'>✔</button>
    <button onClick={props.toCurrent} title='Добавить в текущие'>👀</button>
    </Fragment>
    }
    {props.listName === "CurrentFilms" &&
    <button onClick={props.toWatched} title='Добавить в просмотренные'>✔</button>
    }
  <button onClick={props.onRemove} title='Удалить'>🗑</button>
  </div>
  </li>
};

export default ListItem;

