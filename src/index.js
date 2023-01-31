import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.min.css";
import App from "./App";
import AuthContextProvider from "./components/context/auth-context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </BrowserRouter>
);
