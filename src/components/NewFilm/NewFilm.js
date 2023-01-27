import Section from "../UI/Section";
import FilmForm from "./FilmForm";
import useHttp from "../../hooks/use-http";
import { useContext } from "react";
import { AuthContext } from "../context/auth-context";

const NewFilm = (props) => {

  const authCtx = useContext(AuthContext)
  const uid = authCtx.uid
  const token = authCtx.token

  const createFilm = (filmText, data) => {

    const generatedId = data.name; // firebase-specific => "name" contains generated id
    const createdFilm = { id: generatedId, film: filmText };

    props.onAddFilm(createdFilm);
  }

  const { isLoading, error, sendRequests: submitFilm } = useHttp();

  const enterFilmHandler = async (filmText) => {

    submitFilm({
      url: `${process.env.REACT_APP_DATABASE_URL}/lists/${uid}/towatchfilms.json?auth=${token}`,
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
