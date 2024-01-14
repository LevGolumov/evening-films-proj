// @ts-nocheck
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

const ListItem = (props) => {
  const { t } = useTranslation();
  return (
    <li className="list-item">
      <div className="list-item__title">{props.children}</div>
      <div className="list-item__actions">
        {props.listName === "backlogList" && (
          <Fragment>
            <button
              className="button"
              onClick={props.toWatched}
              title={t("listComponent.listBtns.addToWatched")}
            >
              ✔
            </button>
            <button
              className="button"
              onClick={props.toCurrent}
              title={t("listComponent.listBtns.addToCurrent")}
            >
              👀
            </button>
          </Fragment>
        )}
        {props.listName === "currentList" && (
          <button
            className="button"
            onClick={props.toWatched}
            title={t("listComponent.listBtns.addToWatched")}
          >
            ✔
          </button>
        )}
        <button
          className="button"
          onClick={props.onRemove}
          title={t("listComponent.listBtns.delete")}
        >
          🗑
        </button>
      </div>
    </li>
  );
};

export default ListItem;
