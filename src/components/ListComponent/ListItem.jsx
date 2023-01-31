import { Fragment } from 'react';

const ListItem = (props) => {
  return <li className="list-item">
  <div  className="list-item__title">
  {props.children}
  </div>
  <div className="list-item__actions">
    {props.listName === "toWatchFilms" &&
    <Fragment>
    <button className='button' onClick={props.toWatched} title='Добавить в просмотренные'>✔</button>
    <button className='button' onClick={props.toCurrent} title='Добавить в текущие'>👀</button>
    </Fragment>
    }
    {props.listName === "CurrentFilms" &&
    <button className='button' onClick={props.toWatched} title='Добавить в просмотренные'>✔</button>
    }
  <button className='button' onClick={props.onRemove} title='Удалить'>🗑</button>
  </div>
  </li>
};

export default ListItem;

