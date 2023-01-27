import React, { Fragment, useContext, Suspense } from "react";
import Layout from "./components/layout/Layout";
import { Provider } from "react-redux";
import store from "./store/filmsStore";
import { AuthContext } from "./components/context/auth-context";
import { Navigate, Route, Routes } from "react-router-dom";

const ToWatchFilmsPage = React.lazy(() => import("./pages/ToWatchFilmsPage"));
const WatchedFilmsPage = React.lazy(() => import("./pages/WatchedFilmsPage"));
const CurrentFilmsPage = React.lazy(() => import("./pages/CurrentFilmsPage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));

function App() {
  const loginCtx = useContext(AuthContext);
  const isLoggedIn = loginCtx.isLoggedIn;
  const rootNavigaton = isLoggedIn ? "/to-watch-films" : "/login";
  return (
    <Provider store={store}>
      <Layout>
        <Suspense fallback={<p>Загрузка...</p>}>
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
