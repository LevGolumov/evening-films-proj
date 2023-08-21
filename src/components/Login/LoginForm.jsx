import { useState, useRef, useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function LoginForm() {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loginCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const {t} = useTranslation()

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  function submitHandler(event) {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPsw = passwordInputRef.current.value;

    setIsLoading(true);
    let url;
    let getSecureToken
    if (isLogin) {
      url =
        import.meta.env.VITE_FIREBASE_SIGNIN + import.meta.env.VITE_AUTH_API;
        getSecureToken = true
    } else {
      url =
        import.meta.env.VITE_FIREBASE_SIGNUP + import.meta.env.VITE_AUTH_API;
        getSecureToken = false
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPsw,
        returnSecureToken: getSecureToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = t("techActions.defaultError");
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        if (isLogin){
          loginCtx.login(data.idToken, data.expiresIn, data.localId, data.refreshToken);
          navigate("/")
        } else {
          emailInputRef.current.value = ''
          passwordInputRef.current.value = ''
          setIsLogin(true)          
        }
      })
      .catch((error) => alert(error.message));
  }

  return (
    <section className={"auth"}>
      <h1>{isLogin ? t("login.login") : t("signUp.signUp")}</h1>
      <form onSubmit={submitHandler}>
        <div className={"control"}>
          <label htmlFor="email">{t("login.enterEmail")}</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={"control"}>
          <label htmlFor="password">{t("login.enterPswd")}</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={"actions"}>
          {!isLoading && (
            <button type="submit">
              {isLogin ? t("login.loginBtn") : t("signUp.signUpBtn")}
            </button>
          )}
          {isLoading && <p>{t("techActions.sending")}...</p>}
          <button
            type="button"
            className={"toggle"}
            onClick={switchAuthModeHandler}
          >
            {isLogin
              ? t("login.newAcc")
              : t("signUp.existAcc")}
          </button>
        </div>
      </form>
    </section>
  );
}

export default LoginForm;
