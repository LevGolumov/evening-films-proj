import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AuthContextProvider from "./components/context/auth-context";
import "./i18n"
import "./index.css";
import { Suspense } from "react";
import { Provider } from "react-redux";
import store from "./store/store";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <Suspense fallback={<p style={{"textAlign": "center", "color":"white"}}>...</p>}>
  <BrowserRouter>
    <AuthContextProvider>
    <Provider store={store}>
      <App />
    </Provider>
    </AuthContextProvider>
  </BrowserRouter>
  </Suspense>
);
