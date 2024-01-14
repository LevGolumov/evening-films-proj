import React, { useState, useCallback } from "react";

type AuthContextType = {
  uid: string | null;
  login: (uid: string) => void;
  logout: () => void;
};

export const AuthContext = React.createContext<AuthContextType>({
  // token: "",
  uid: "",
  login: () => {},
  logout: () => {},
});

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const initialId = localStorage.getItem("uid");
  // const [token, setToken] = useState(localStorage.getItem("token"));
  const [uid, setUid] = useState(initialId);

  const logoutHandler = useCallback(() => {
    // setToken(undefined);
    setUid(null);
    // localStorage.removeItem("token");
    // localStorage.removeItem("expirationDate");
    localStorage.removeItem("uid");
    // localStorage.removeItem("refreshToken");
  }, []);

  function loginHandler(localId: string) {
    // setToken(token);
    setUid(localId);

    // const expirationTime = new Date(new Date().getTime() + +expiration * 1000);
    // localStorage.setItem("token", token);
    // localStorage.setItem("expirationDate", expirationTime.toISOString());
    localStorage.setItem("uid", localId);
    // localStorage.setItem("refreshToken", refreshToken);
  }

  const contextValue = {
    // token,
    uid,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export default AuthContextProvider;
