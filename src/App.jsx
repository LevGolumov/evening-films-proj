import React, { Fragment, useContext, Suspense, useEffect } from "react";
import Layout from "./components/layout/Layout";
import { Provider } from "react-redux";
import store from "./store/filmsStore";
import { AuthContext } from "./components/context/auth-context";
import { Navigate, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ToWatchFilmsPage = React.lazy(() => import("./pages/ToWatchFilmsPage"));
const WatchedFilmsPage = React.lazy(() => import("./pages/WatchedFilmsPage"));
const CurrentFilmsPage = React.lazy(() => import("./pages/CurrentFilmsPage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));

function App() {
  const loginCtx = useContext(AuthContext);
  const isLoggedIn = loginCtx.isLoggedIn;
  const rootNavigaton = isLoggedIn ? "/to-watch-films" : "/login";
  const { t } = useTranslation();

  function calculateRemainingTime(expirationTime) {
    const currentTime = new Date().getTime();
    const updExpTime = new Date(expirationTime).getTime();
    const remainingTime = updExpTime - currentTime;
  
    return remainingTime;
  }

  useEffect(() => {
    const expirationTime = localStorage.getItem("expirationDate");
    const refreshToken = localStorage.getItem("refreshToken");
    const remainingTime = calculateRemainingTime(expirationTime);
    function refreshHandler(){
      fetch(
        "https://securetoken.googleapis.com/v1/token?key=" +
          import.meta.env.VITE_AUTH_API,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          }),
        }
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((data) => {
          loginCtx.login(data.id_token, data.expires_in, data.user_id, data.refresh_token)
        });
    }
    
    let refreshTimer = setTimeout(refreshHandler, remainingTime)

    return () => {
      clearTimeout(refreshTimer)
    }
      
  }, []);

  return (
    <Provider store={store}>
      <Layout>
        <Suspense fallback={<p>{t("techActions.loading")}...</p>}>
          <Routes>
            <Route path="*" element={<Navigate replace to={rootNavigaton} />} />
            {!isLoggedIn && <Route path="/login" element={<LoginPage />} />}
            {isLoggedIn && (
              <Fragment>
                <Route path="/to-watch-films" element={<ToWatchFilmsPage />} />
                <Route path="/watched-films" element={<WatchedFilmsPage />} />
                <Route path="/current-films" element={<CurrentFilmsPage />} />
              </Fragment>
            )}
          </Routes>
        </Suspense>
      </Layout>
    </Provider>
  );
}

export default App;
