import React, { useState, useCallback } from "react";


export const AuthContext = React.createContext({
  token: "",
  uid: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

function AuthContextProvider(props) {
  const initialId = localStorage.getItem("uid");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [uid, setUid] = useState(initialId);
  const isLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(undefined);
    setUid(undefined);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("uid");
    localStorage.removeItem("refreshToken");
  }, []);

  function loginHandler(token, expiration, localId, refreshToken) {
    setToken(token);
    setUid(localId);

    const expirationTime = new Date(new Date().getTime() + +expiration * 1000);
    localStorage.setItem("token", token);
    localStorage.setItem("expirationDate", expirationTime.toISOString());
    localStorage.setItem("uid", localId);
    localStorage.setItem("refreshToken", refreshToken);
  }

  const contextValue = {
    token,
    isLoggedIn,
    uid,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
