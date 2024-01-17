import { FC } from "react";
import useHttp from "../../hooks/use-http";
import { ListAndTitleFunction } from "../../types/globalTypes";
import Section from "../ui/Section";
import FilmForm from "./FilmForm";

type NewFilmProps = {
  onAddFilm: ListAndTitleFunction;
};

const NewFilm: FC<NewFilmProps> = ({ onAddFilm }) => {
  const { isLoading, error } = useHttp();

  const enterFilmHandler = async (filmText: string) => {
    onAddFilm("backlogList", filmText);
  };

  return (
    <Section>
      <FilmForm onEnterFilm={enterFilmHandler} loading={isLoading} />
      {error && <p>{error}</p>}
    </Section>
  );
};

export default NewFilm;
