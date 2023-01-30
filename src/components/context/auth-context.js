import React, {useState, useEffect, useCallback} from "react";

let logoutTimer;

export const AuthContext = React.createContext({
    token: '',
    uid: '',
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {}
})

function calculateRemainingTime(expirationTime){
    const currentTime = new Date().getTime();
    const updExpTime = new Date(expirationTime).getTime();
    const remainingTime = updExpTime - currentTime

    return remainingTime
}

function retrieveStoredToken(){
    const initialToken = localStorage.getItem('token')
    const expirationTime = localStorage.getItem('expirationDate')
    const remainingTime = calculateRemainingTime(expirationTime)
    if (remainingTime <= 0){
        return null
    }

    return {
        token: initialToken,
        duration: remainingTime
    }
}

function AuthContextProvider(props) {
    
    const tokenData = retrieveStoredToken()
    let initialToken
    if (tokenData){
        initialToken = tokenData.token
    }
    const initialId = localStorage.getItem('uid')
    // const currentRefreshToken = localStorage.getItem('refreshToken')
    const [token, setToken] = useState(initialToken)
    const [uid, setUid] = useState(initialId)
    const isLoggedIn = !!token

    const logoutHandler = useCallback(() => {
        setToken(undefined)
        setUid(undefined)
        localStorage.removeItem('token')
        localStorage.removeItem('expirationDate')
        localStorage.removeItem('uid')
        localStorage.removeItem('refreshToken')

        if (logoutTimer){
            clearTimeout(logoutTimer)
        }
    }, [])

    // const refreshUser = useCallback(() => {
    //     fetch()
    // }, [])

    useEffect(() => {
        if(tokenData){
            logoutTimer = setTimeout(logoutHandler, tokenData.duration)
        }
    }, [tokenData, logoutHandler])

    function loginHandler(token, expiration, localId, refreshToken){
        setToken(token)
        setUid(localId)

        const expirationTime = new Date(new Date().getTime() + (+expiration * 1000))
        localStorage.setItem('token', token)
        localStorage.setItem('expirationDate', expirationTime.toISOString())
        localStorage.setItem('uid', localId)
        localStorage.setItem('refreshToken', refreshToken)

        const remainingTime = calculateRemainingTime(expirationTime)
        logoutTimer = setTimeout(logoutHandler, remainingTime)
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