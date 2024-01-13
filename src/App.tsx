import React, { Fragment, Suspense, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Provider } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthContext } from "./components/context/auth-context";
import Layout from "./components/layout/Layout";
import store from "./store/store.ts";
import CommonListPage from "./pages/CommonListPage.tsx";

// const BacklogListPage = React.lazy(() => import("./pages/BacklogListPage.tsx"));
// const DoneListPage = React.lazy(() => import("./pages/DoneListPage.tsx"));
// const CurrentListPage = React.lazy(() => import("./pages/CurrentListPage.tsx"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));

function App() {
  const loginCtx = useContext(AuthContext);
  const isLoggedIn = loginCtx.isLoggedIn;
  const rootNavigaton = isLoggedIn ? "/backlog-list" : "/login";
  const { t } = useTranslation();  

  return (
    <Provider store={store}>
      <Layout>
        <Suspense fallback={<p>{t("techActions.loading")}...</p>}>
          <Routes>
            <Route path="*" element={<Navigate replace to={rootNavigaton} />} />
            {!isLoggedIn && <Route path="/login" element={<LoginPage />} />}
            {isLoggedIn && (
              <Fragment>
                <Route path="/backlog-list" element={<CommonListPage passedList="backlogList" />} />
                <Route path="/done-list" element={<CommonListPage passedList="doneList" />} />
                <Route path="/current-list" element={<CommonListPage passedList="currentList" />} />
              </Fragment>
            )}
          </Routes>
        </Suspense>
      </Layout>
    </Provider>
  );
}

export default App;
