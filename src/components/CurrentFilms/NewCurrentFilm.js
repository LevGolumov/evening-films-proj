import Modal from "../UI/Modal";
import {useState, useEffect, useCallback} from 'react'
import Button from "../UI/Button";

function NewCurrentFilm(props) {
    const [filmSuggestion, setFilmSuggestion] = useState(null)
    const findRandomFilm = useCallback (() => {
        const randomFilmItem = props.films[Math.floor(Math.random()*props.films.length)]
        setFilmSuggestion(randomFilmItem)
    }, [props.films])

    useEffect(() => findRandomFilm(), [findRandomFilm])
    return ( 
        <Modal onClick={props.onCloseModal}>
        {filmSuggestion === null ? 'Nothing' : filmSuggestion.film}
        <Button onClick={findRandomFilm}>Другой вариант</Button>
        <Button onClick={props.onAddFilm.bind(null, filmSuggestion)}>Смотреть этот</Button>

        </Modal>
     );
}

export default NewCurrentFilm;