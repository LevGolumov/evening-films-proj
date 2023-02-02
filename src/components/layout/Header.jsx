import Button from "../UI/Button";
import { NavLink, useLocation } from "react-router-dom";
import { Fragment, useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { filmsActions } from "../../store/filmsStore";

function Header() {
  const { t, i18n } = useTranslation();
  const loginCtx = useContext(AuthContext);
  const dispatch = useDispatch()
  const loginButtonText = loginCtx.isLoggedIn
    ? t("header.logout")
    : t("header.login");
  
  let chosenLang = localStorage.getItem("i18nextLng")
  if (!chosenLang) {
    chosenLang = "en"
  }
  const [lang, setLang] = useState(chosenLang);
  const langBtn =
    lang === "ru" ? (
      <Fragment>
        EN/<b>RU</b>
      </Fragment>
    ) : (
      <Fragment>
        <b>EN</b>/RU
      </Fragment>
    );

  const {pathname} = useLocation()
  
  function pathBtnHighlight(btn){
    if (pathname.includes(btn)){
      return "button--active"
    }
  }
  function changeLanguage() {
    if (lang === "ru") {
      setLang("en");
      i18n.changeLanguage("en");
    } else {
      setLang("ru");
      i18n.changeLanguage("ru");
    }
  }

  function logoutHandler(){
    loginCtx.logout()
    dispatch(filmsActions.logout())
  }

  return (
    <Fragment>
      <header className={"header"}>
        <nav className={"header__nav container"}>
          <NavLink className={"header__nav--link"} to="/">
            <div className="nav__title">ToBinge</div>
          </NavLink>
          <span className={"header__langChoise"} onClick={changeLanguage}>
            {langBtn}            
          </span>
          <NavLink className={"header__nav--link header__logout"} to="/login">
            <span onClick={loginCtx.isLoggedIn ? logoutHandler : undefined}>
              {loginButtonText}
            </span>
          </NavLink>
        </nav>
      </header>

      {loginCtx.isLoggedIn && (
        <div className={"header__buttons container"}>
          <NavLink to="/">
            <Button className={pathBtnHighlight('to-watch-films')}>{t("lists.toWatch")}</Button>
          </NavLink>
          <NavLink to="/current-films">
            <Button className={pathBtnHighlight('current-films')}>{t("lists.current")}</Button>
          </NavLink>
          <NavLink to="/watched-films">
            <Button className={pathBtnHighlight('watched-films')}>{t("lists.watched")}</Button>
          </NavLink>
        </div>
      )}
    </Fragment>
  );
}

export default Header;
