import Layout from "./components/layout/Layout";
import ToWatchFilmsPage from "./pages/ToWatchFilmsPage";
import { Provider } from "react-redux";
import store from "./store/filmsStore";
import { Navigate, Route, Routes } from "react-router-dom";
import WatchedFilmsPage from "./pages/WatchedFilmsPage";
import CurrentFilmsPage from "./pages/CurrentFilmsPage";

function App() {
  return (
    <Provider store={store}>
      <Layout>
        <Routes>
          <Route path='/' element={<Navigate replace to='/to-watch-films' /> } />
          <Route path="/to-watch-films" element={<ToWatchFilmsPage />} />
          <Route path="/watched-films" element={<WatchedFilmsPage />} />
          <Route path="/current-films" element={<CurrentFilmsPage />} />
        </Routes>
      </Layout>
    </Provider>
  );
}

export default App;
