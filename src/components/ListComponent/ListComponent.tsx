import { useTranslation } from "react-i18next";
import { IListFinalItem, IListItem, listNameType } from "../../types/functionTypes";
import { moveItemOverType } from "../../utilities/functions";
import Section from "../UI/Section";
import classes from "./ListComponent.module.css";
import ListItem from "./ListItem";

type ListComponentType = {
  header: string;
  found: string;
  isSearched: boolean;
  loading: boolean;
  error?: string | null;
  nothingInList: string;
  items: IListFinalItem[];
  listName: listNameType;
  removeFilmHandler: (id: string) => void;
  moveItemOver: moveItemOverType;
};

const ListComponent = ({
  header,
  found,
  isSearched,
  loading,
  error,
  nothingInList,
  items,
  listName,
  removeFilmHandler,
  moveItemOver,
}: ListComponentType) => {
  let filmList;
  // let isUnwatchedList;
  let content;
  const { t } = useTranslation();

  // if (toWatchFilmsList !== undefined) {
  //   isUnwatchedList = !!toWatchFilmsList.length;
  //   filmList = (
  //     <h2>
  //       {t("pages.currentList.empty.header")}
  //       <br />{" "}
  //       <Button onClick={onNewFilmRequest}>
  //         {t("pages.currentList.empty.btn")}
  //       </Button>
  //     </h2>
  //   );
  // } else {
  //   isUnwatchedList = false;
  //   filmList = <h2>{nothingInList}</h2>;
  // }

  if (items.length > 0) {
    // let reverseFilmList;
    // if (!isUnwatchedList) {
    //   reverseFilmList = [...items].reverse();
    // } else {
    //   reverseFilmList = [...items];
    // }
    filmList = (
      <div>
        <h2 className="list__header">{header}</h2>
        {isSearched && <h3>{found}</h3>}
        <ul>
          {listName === "backlogList"
            ? items.map((item) => (
                <ListItem
                  key={item.id}
                  listName={listName}
                  toWatched={() => moveItemOver("doneList", item)}
                  toCurrent={() => moveItemOver("currentList", item)}
                  onRemove={() => removeFilmHandler(item.id)}
                >
                  {item.title}
                </ListItem>
              ))
            : listName === "currentList"
            ? items.map((item) => (
                <ListItem
                  key={item.id}
                  listName={listName}
                  toWatched={() => moveItemOver("doneList", item)}
                  onRemove={() => removeFilmHandler(item.id)}
                >
                  {item.title}
                </ListItem>
              ))
            : items.map((item) => (
                <ListItem
                  key={item.id}
                  listName={listName}
                  onRemove={() => removeFilmHandler(item.id)}
                >
                  {item.title}
                </ListItem>
              ))}
        </ul>
        {/* {isUnwatchedList && (
          <Button onClick={onNewFilmRequest}>
            {t("pages.currentList.notEmpty.btn")}
          </Button>
        )} */}
      </div>
    );
  } else {
    filmList = <h2>{nothingInList}</h2>;
  }

  // if (
  //   toWatchFilmsList &&
  //   toWatchFilmsList.length === 0 &&
  //   items.length === 0 &&
  //   !loading
  // ) {
  //   filmList = (
  //     <h2>
  //       {t("pages.currentList.empty.nothingness.1")} <br />{" "}
  //       {t("pages.currentList.empty.nothingness.2")}
  //     </h2>
  //   );
  // }

  content = filmList;

  if (loading) {
    content = t("techActions.loading") + "...";
  }

  if (error) {
    content = (
      <button className="button">
        {t("techActions.tryAgain")}
      </button>
    );
  }

  return (
    <Section>
      <div className={classes.container}>{content}</div>
    </Section>
  );
};

export default ListComponent;
