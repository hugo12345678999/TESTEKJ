import {createContext, useEffect, useState} from 'react'


const authDefault = {
    isAuthenticated: false,
    dataUser: null
}


export const AuthContext = createContext({
    authInfo: authDefault,
    setDataUser: (dataUser) => {
    },
    loading: false,
    notiMessage: '',
    setNotiMessage: () => {}
})

const AuthContextProvider = ({children}) => {
    const [authInfo, setAuthInfo] = useState(authDefault);
    const [loading, setLoading] = useState(true);
    const [notiMessage, setNotiMessage] = useState(null)
    // const [notiMessageInfo, setNotiMessageInfo] = useState(null)
    useEffect(() => {
        try {
            const dataUserParse = localStorage.getItem("dataUser");
            if (dataUserParse) {
                const dataUserInitial = JSON.parse(dataUserParse);
                if (dataUserInitial) {
                    setAuthInfo({
                        isAuthenticated: true,
                        dataUser: dataUserInitial
                    })
                } else {
                    setAuthInfo({
                        isAuthenticated: false,
                        dataUser: null
                    })
                }
            } else {
                setAuthInfo({
                    isAuthenticated: false,
                    dataUser: null
                })
            }
        } catch (e) {
            setAuthInfo({
                isAuthenticated: false,
                dataUser: null
            })
        }
        setLoading(false);
    }, [])

    const setDataUser = (dataUser) => {
        if (dataUser) {
            localStorage.setItem("dataUser", JSON.stringify(dataUser));
            setAuthInfo({
                isAuthenticated: true,
                dataUser: dataUser
            })
        } else {
            localStorage.removeItem("dataUser")
            setAuthInfo({
                isAuthenticated: false,
                dataUser: dataUser
            })
        }
    }

    const authContextData = {
        authInfo,
        loading,
        setDataUser,
        notiMessage,
        setNotiMessage,
        // notiMessageInfo,
        // setNotiMessageInfo
    }

    return (
        <AuthContext.Provider value={authContextData}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider
