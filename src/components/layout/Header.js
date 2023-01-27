import Button from "../UI/Button";
import classes from "./Header.module.css";
import { NavLink } from "react-router-dom";
import { Fragment, useContext } from "react";
import { AuthContext } from "../context/auth-context";

function Header() {
  const loginCtx = useContext(AuthContext)
  const loginButtonText = loginCtx.isLoggedIn ? "Выйти" : "Войти"
  return (
    <Fragment>
      <header className={classes.header}>
        <nav className={classes.header__nav}>
          <NavLink className={classes['header__nav--link']} to="/">
            <div>ToWatch</div>
          </NavLink>
          <NavLink className={classes['header__nav--link']} to="/login">
            <div onClick={loginCtx.isLoggedIn ? loginCtx.logout : null}>{loginButtonText}</div>
          </NavLink>
        </nav>
      </header>

      {loginCtx.isLoggedIn && <div className={classes.header__buttons}>
        <NavLink to="/">
          <Button>На просмотр</Button>
        </NavLink>
        <NavLink to="/current-films">
          <Button>Текущие</Button>
        </NavLink>
        <NavLink to="/watched-films">
          <Button>Просмотренные</Button>
        </NavLink>
      </div>}
    </Fragment>
  );
}

export default Header;
