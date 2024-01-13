import Section from "../UI/Section";
import FilmForm from "./FilmForm";
import useHttp from "../../hooks/use-http";
import { FC, useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { IListAndTitle, ListAndTitleFunction } from "../../types/globalTypes";

type NewFilmProps = {
  onAddFilm: ListAndTitleFunction;
};

const NewFilm: FC<NewFilmProps> = ({onAddFilm}) => {

  const authCtx = useContext(AuthContext)
  const uid = authCtx.uid
  const token = authCtx.token

  // const createFilm = (filmText, data) => {

  //   const generatedId = data.name; // firebase-specific => "name" contains generated id
  //   const createdFilm = { id: generatedId, film: filmText };

  //   onAddFilm(createdFilm);
  // }

  const { isLoading, error, sendRequests: submitFilm } = useHttp();

  const enterFilmHandler = async (filmText: string) => {

    // submitFilm({
    //   url: `${import.meta.env.VITE_DATABASE_URL}/lists/${uid}/default/backlogList.json?auth=${token}`,
    //   method: "POST",
    //   body: { film: filmText.trim() },
    //   headers: {
    //     "Content-Type": "application/json",
    //   },      
    // },
    // createFilm.bind(null, filmText));

    onAddFilm('backlogList', filmText);
  };

  return (
    <Section>
      <FilmForm onEnterFilm={enterFilmHandler} loading={isLoading} />
      {error && <p>{error}</p>}
    </Section>
  );
};

export default NewFilm;
