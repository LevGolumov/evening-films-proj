import Section from "../UI/Section";
import FilmForm from "./FilmForm";
import useHttp from "../../hooks/use-http";

const NewFilm = (props) => {
  const createFilm = (filmText, data) => {

    const generatedId = data.name; // firebase-specific => "name" contains generated id
    const createdFilm = { id: generatedId, film: filmText };

    props.onAddFilm(createdFilm);
  }

  const { isLoading, error, sendRequests: submitFilm } = useHttp();

  const enterFilmHandler = async (filmText) => {

    submitFilm({
      url: "https://evening-films-default-rtdb.europe-west1.firebasedatabase.app/towatchfilms.json",
      method: "POST",
      body: { film: filmText.trim() },
      headers: {
        "Content-Type": "application/json",
      },      
    },
    createFilm.bind(null, filmText));
  };

  return (
    <Section>
      <FilmForm onEnterFilm={enterFilmHandler} loading={isLoading} />
      {error && <p>{error}</p>}
    </Section>
  );
};

export default NewFilm;
