import Button from "../UI/Button";
import { NavLink, useLocation } from "react-router-dom";
import { Fragment, useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { itemsActions } from "../../store/itemsStore";
import { auth } from "../../config/firebaseConfig";

function Header() {
  const { t, i18n } = useTranslation();
  const loginCtx = useContext(AuthContext);
  const dispatch = useDispatch()
  const loginButtonText = loginCtx.uid
    ? t("header.logout")
    : t("header.login");
  
  let chosenLang = localStorage.getItem("i18nextLng")
  if (chosenLang === "ru-RU" || chosenLang === "ru"){
    chosenLang = "ru"
  } else {
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
  
  function pathBtnHighlight(btn: string){
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
    auth.signOut()
    dispatch(itemsActions.logout())
  }

  return (
    <Fragment>
      <header className='bg-sky-900 text-white px-24 py-5'>
        <nav className={"flex justify-between"}>
          <NavLink className='' to="/">
            <div className="text-xl">Unlist</div>
          </NavLink>
          {/* <span className={"header__langChoise"} onClick={changeLanguage}>
            {langBtn}            
          </span> */}
          <NavLink className={"header__nav--link header__logout"} to="/login">
            <span onClick={loginCtx.uid ? logoutHandler : undefined}>
              {loginButtonText}
            </span>
          </NavLink>
        </nav>
      </header>

      {loginCtx.uid && (
        <div className={"header__buttons container"}>
          <NavLink to="/">
            <Button className={pathBtnHighlight('backlog-list')}>{t("lists.toWatch")}</Button>
          </NavLink>
          <NavLink to="/current-list">
            <Button className={pathBtnHighlight('current-list')}>{t("lists.current")}</Button>
          </NavLink>
          <NavLink to="/done-list">
            <Button className={pathBtnHighlight('done-list')}>{t("lists.watched")}</Button>
          </NavLink>
        </div>
      )}
    </Fragment>
  );
}

export default Header;
