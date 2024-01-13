import { useTranslation } from "react-i18next";
import { IListFinalItem, listNameType } from "../../types/globalTypes";
import { moveItemOverType } from "../../utilities/functions";
import Button from "../UI/Button";
import Section from "../UI/Section";
import classes from "./ListComponent.module.css";
import ListItem from "./ListItem";

type ListComponentType = {
  header: string;
  found?: string;
  isSearched?: boolean;
  loading?: boolean;
  error?: string | null;
  nothingInList?: string;
  items: IListFinalItem[];
  listName: listNameType;
  removeItemHandler: (id: string) => void;
  moveItemOver?: moveItemOverType;
  onNewItemRequest?: () => void;
};

const ListComponent = ({
  header,
  found,
  isSearched,
  // loading,
  // error,
  nothingInList,
  items,
  listName,
  removeItemHandler,
  moveItemOver,
  onNewItemRequest,
}: ListComponentType) => {
  const { t } = useTranslation();

  // if (loading) {
  //   content = t("techActions.loading") + "...";
  // }

  // if (error) {
  //   content = <button className="button">{t("techActions.tryAgain")}</button>;
  // }

  return (
    <Section>
      <div className={classes.container}>
        {items.length === 0 && nothingInList && listName !== "currentList" && (
          <h2>{nothingInList}</h2>
        )}
        {listName === "currentList" && items.length === 0 && (          
          <h2>
            {t("pages.currentList.empty.header")}
            <br />{" "}
            <Button onClick={onNewItemRequest}>
              {t("pages.currentList.empty.btn")}
            </Button>
          </h2>
        )}
        {items.length > 0 && (
          <div>
            <h2 className="list__header">{header}</h2>
            {isSearched && <h3>{found}</h3>}
            <ul>
              {listName === "backlogList" && moveItemOver
                ? items.map((item) => (
                    <ListItem
                      key={item.id}
                      listName={listName}
                      toWatched={() => moveItemOver("doneList", item)}
                      toCurrent={() => moveItemOver("currentList", item)}
                      onRemove={() => removeItemHandler(item.id)}
                    >
                      {item.title}
                    </ListItem>
                  ))
                : listName === "currentList" && moveItemOver
                ? items.map((item) => (
                    <ListItem
                      key={item.id}
                      listName={listName}
                      toWatched={() => moveItemOver("doneList", item)}
                      onRemove={() => removeItemHandler(item.id)}
                    >
                      {item.title}
                    </ListItem>
                  ))
                : items.map((item) => (
                    <ListItem
                      key={item.id}
                      listName={listName}
                      onRemove={() => removeItemHandler(item.id)}
                    >
                      {item.title}
                    </ListItem>
                  ))}
            </ul>
            {listName === "currentList" && (
              <Button onClick={onNewItemRequest}>
                {t("pages.currentList.notEmpty.btn")}
              </Button>
            )}
          </div>
        )}
      </div>
    </Section>
  );
};

export default ListComponent;
