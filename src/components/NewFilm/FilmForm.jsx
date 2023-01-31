import { useRef } from 'react';

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
    <form className={"form"} onSubmit={submitHandler}>
      <input  placeholder="Что желаете посмотреть?" className='input' type='text' ref={taskInputRef} />
      <button className='button'>{props.loading ? 'Отправляю...' : 'Добавить'}</button>
    </form>
  );
};

export default FilmForm;
