import classes from './ListItem.module.css';

const ListItem = (props) => {
  return <li className={classes.task}>
  <div>
  {props.children}
  </div>
  <div className={classes.actions}>
  <button onClick={props.onRemove}>−</button>
  </div>
  </li>
};

export default ListItem;