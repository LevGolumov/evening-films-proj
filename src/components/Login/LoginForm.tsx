import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { auth } from "../../config/firebaseConfig";

function LoginForm() {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);  
  const { t } = useTranslation();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  function submitHandler(event) {
    event.preventDefault();
    setIsLoading(true);
    const enteredEmail = emailInputRef.current.value;
    const enteredPsw = passwordInputRef.current.value;

    if (!isLogin) {
      createUserWithEmailAndPassword(auth, enteredEmail, enteredPsw).then(
        () => {
          setIsLoading(false)
          emailInputRef.current.value = "";
          passwordInputRef.current.value = "";
          setIsLogin(true);
        }
      );
    } else {
      signInWithEmailAndPassword(auth, enteredEmail, enteredPsw)
    }
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
            {isLogin ? t("login.newAcc") : t("signUp.existAcc")}
          </button>
        </div>
      </form>
    </section>
  );
}

export default LoginForm;
