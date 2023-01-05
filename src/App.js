import Header from "./components/PageComponents/Header";
import FilmsPage from "./pages/FilmsPage";
import { Provider } from "react-redux";
import store from "./store/filmsStore";

function App() {
  return (
    <Provider store={store}>
      <Header />
      <FilmsPage />
    </Provider>
  );
}

export default App;
