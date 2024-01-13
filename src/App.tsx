import React, { Fragment, Suspense, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthContext } from "./components/context/auth-context";
import Layout from "./components/layout/Layout";
import CommonListPage from "./pages/CommonListPage.tsx";
import {
  CollectionReference,
  DocumentData,
  QueryFieldFilterConstraint,
  collection,
  where,
  query,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { firestoreDB } from "./config/firebaseConfig.ts";
import { useDispatch } from "react-redux";
import { itemsActions } from "./store/itemsStore.ts";
import { IParentList } from "./types/globalTypes.ts";

// const BacklogListPage = React.lazy(() => import("./pages/BacklogListPage.tsx"));
// const DoneListPage = React.lazy(() => import("./pages/DoneListPage.tsx"));
// const CurrentListPage = React.lazy(() => import("./pages/CurrentListPage.tsx"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));

function App() {
  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const rootNavigaton = isLoggedIn ? "/backlog-list" : "/login";
  const uid = authCtx.uid;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const listsQuerryArgs: [
    CollectionReference<DocumentData, DocumentData>,
    QueryFieldFilterConstraint
  ] = [collection(firestoreDB, "lists"), where("author", "==", uid)];

  const listsQuerry = query(...listsQuerryArgs);

  useEffect(() => {
    if (uid && isLoggedIn) {
      getDocs(listsQuerry).then((querySnapshot) => {
        if (querySnapshot.empty) {
          const listInfo: IParentList = {
            author: uid,
            createdAt: new Date().getTime(),
            favorite: true,
            title: "default",
          };
          addDoc(collection(firestoreDB, "lists"), listInfo).then((docRef) => {
            dispatch(itemsActions.setParentList(docRef.id));
          });
          return;
        }

        dispatch(itemsActions.setParentList(querySnapshot.docs[0].id));
      });
    }
  }, [uid, isLoggedIn]);

  return (
    <Layout>
      <Suspense fallback={<p>{t("techActions.loading")}...</p>}>
        <Routes>
          <Route path="*" element={<Navigate replace to={rootNavigaton} />} />
          {!isLoggedIn && <Route path="/login" element={<LoginPage />} />}
          {isLoggedIn && (
            <Fragment>
              <Route
                path="/backlog-list"
                element={<CommonListPage passedList="backlogList" />}
              />
              <Route
                path="/done-list"
                element={<CommonListPage passedList="doneList" />}
              />
              <Route
                path="/current-list"
                element={<CommonListPage passedList="currentList" />}
              />
            </Fragment>
          )}
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
