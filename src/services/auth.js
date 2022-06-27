import {createContext, useContext, useEffect, useState} from "react";
import Loading from "../components/loading";
import baseUrl from "../vars";
import sendReq from "./sendReq";

const AuthContext = createContext(undefined);

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const url = baseUrl + '/api/user'
        sendReq(url).then(res => {
            setUser(res.data)
            setReady(true)
        }).catch((r) => {
            console.error(r)
            // window.location.replace(baseUrl + '/auth/login')
        })
    }, [])

    const reloadData = async () => {
        const url = baseUrl + '/api/user'
        sendReq(url).then(res => {
            setUser(res.data)
        }).catch((r) => {
            console.error(r)
            // window.location.replace(baseUrl + '/auth/login')
        })
    }

    const value = {
        data: user?.data,
        user: user?.user,
        reloadData
    }

    if (ready) {
        return (
            <AuthContext.Provider value={value}>
                {children}
            </AuthContext.Provider>
        )
    }
    return (
        <AuthContext.Provider value={value}>
            <Loading/>
        </AuthContext.Provider>
    )
}
