import { useRef } from 'react';

import classes from './FilmForm.module.css';

const FilmForm = (props) => {
  const taskInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredValue = taskInputRef.current.value;

    if (enteredValue.trim().length > 0) {
      props.onEnterFilm(enteredValue);
      taskInputRef.current.value = ''
    }
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <input type='text' ref={taskInputRef} />
      <button>{props.loading ? 'Sending...' : 'Add Film'}</button>
    </form>
  );
};

export default FilmForm;
