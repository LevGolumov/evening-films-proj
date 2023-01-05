import classes from './ListItem.module.css';
import { Fragment } from 'react';

const ListItem = (props) => {
  return <li className={classes.task}>
  <div>
  {props.children}
  </div>
  <div className={classes.actions}>
    {props.listName === "unwatchedFilms" &&
    <Fragment>
    <button onClick={props.toWatched}>✔</button>
    <button onClick={props.toCurrent}>👀</button>
    </Fragment>
    }
  <button onClick={props.onRemove}>−</button>
  </div>
  </li>
};

export default ListItem;