import Button from "../UI/Button";
import { NavLink } from "react-router-dom";
import { Fragment, useContext } from "react";
import { AuthContext } from "../context/auth-context";

function Header() {
  const loginCtx = useContext(AuthContext)
  const loginButtonText = loginCtx.isLoggedIn ? "Выйти" : "Войти"
  return (
    <Fragment>
      <header className={"header"}>
        <nav className={"header__nav container"}>
          <NavLink className={'header__nav--link'} to="/">
            <div className="nav__title">ToBinge</div>
          </NavLink>
          <NavLink className={'header__nav--link'} to="/login">
            <div onClick={loginCtx.isLoggedIn ? loginCtx.logout : null}>{loginButtonText}</div>
          </NavLink>
        </nav>
      </header>

      {loginCtx.isLoggedIn && <div className={"header__buttons container"}>
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
