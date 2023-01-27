import Layout from "./components/layout/Layout";
import ToWatchFilmsPage from "./pages/ToWatchFilmsPage";
import { Provider } from "react-redux";
import store from "./store/filmsStore";
import { Navigate, Route, Routes } from "react-router-dom";
import WatchedFilmsPage from "./pages/WatchedFilmsPage";
import CurrentFilmsPage from "./pages/CurrentFilmsPage";
import LoginPage from "./pages/LoginPage";
import { Fragment, useContext } from "react";
import { AuthContext } from "./components/context/auth-context";

function App() {
  const loginCtx = useContext(AuthContext);
  const isLoggedIn = loginCtx.isLoggedIn;
  const rootNavigaton = isLoggedIn ? "/to-watch-films" : "/login";
  return (
    <Provider store={store}>
      <Layout>
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
      </Layout>
    </Provider>
  );
}

export default App;
