// @ts-nocheck
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

const FilmForm = (props) => {
  const taskInputRef = useRef();
  const {t} = useTranslation()

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
      <input  placeholder={t("addNewFilm.placeholder")} className='input' type='text' ref={taskInputRef} />
      <button className='button'>{props.loading ? t("techActions.sending") : t("addNewFilm.btn")}</button>
    </form>
  );
};

export default FilmForm;
