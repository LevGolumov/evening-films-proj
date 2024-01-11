import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.min.css";
import App from "./App";
import AuthContextProvider from "./components/context/auth-context";
import "./i18n"
import { Suspense } from "react";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <Suspense fallback={<p style={{"textAlign": "center", "color":"white"}}>...</p>}>
  <BrowserRouter>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </BrowserRouter>
  </Suspense>
);
