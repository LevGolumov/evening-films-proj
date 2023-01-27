import React, {useState} from "react";

export const AuthContext = React.createContext({
    token: '',
    uid: '',
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {}
})

function AuthContextProvider(props) {
    const initialToken = localStorage.getItem('token')
    const initialId = localStorage.getItem('uid')
    const [token, setToken] = useState(initialToken)
    const [uid, setUid] = useState(initialId)
    const isLoggedIn = !!token

    function loginHandler(token, localId){
        setToken(token)
        setUid(localId)
        localStorage.setItem('token', token)
        localStorage.setItem('uid', localId)
    }

    function logoutHandler(){
        setToken(undefined)
        setUid(undefined)
        localStorage.removeItem('token')
        localStorage.removeItem('uid')
    }

    const contextValue = {
        token,
        isLoggedIn,
        uid,
        login: loginHandler,
        logout: logoutHandler
    }

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
}

export default AuthContextProvider;