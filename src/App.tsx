import React, { Fragment, Suspense, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Provider } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthContext } from "./components/context/auth-context";
import Layout from "./components/layout/Layout";
import { auth } from "./config/firebaseConfig";
import store from "./store/store.ts";

const ToWatchFilmsPage = React.lazy(() => import("./pages/ToWatchFilmsPage.tsx"));
const WatchedFilmsPage = React.lazy(() => import("./pages/WatchedFilmsPage.tsx"));
const CurrentFilmsPage = React.lazy(() => import("./pages/CurrentFilmsPage.tsx"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));

function App() {
  const loginCtx = useContext(AuthContext);
  const isLoggedIn = loginCtx.isLoggedIn;
  const rootNavigaton = isLoggedIn ? "/to-watch-films" : "/login";
  const { t } = useTranslation();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        loginCtx.login(user.accessToken, user.uid)
      } else {
        loginCtx.logout()
      }
    });
  }, [auth]);

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
