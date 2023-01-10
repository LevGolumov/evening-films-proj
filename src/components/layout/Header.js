import Button from "../UI/Button";
import classes from "./Header.module.css";
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header className={classes.header}>
      <div className={classes.header__buttons}>
        <NavLink to="/">
          <Button>На просмотр</Button>
        </NavLink>
        <NavLink to="/current-films">
          <Button>Текущие</Button>
        </NavLink>
        <NavLink to="/watched-films">
          <Button>Просмотренные</Button>
        </NavLink>
      </div>
    </header>
  );
}

export default Header;
