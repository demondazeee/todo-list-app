import { createContext, ReactNode, useEffect, useState } from "react"
import { AuthBody, useAuth } from "../hooks/useAuth"

type AuthContextProp = {
    children: ReactNode
}

export const authContext=  createContext<AuthBody | null>(null)

const AuthContext = ({children}: AuthContextProp) => {
    const auth = useAuth()
    


    const defaultContext = {
        ...auth,
    }
    return (
        <authContext.Provider value={defaultContext}>
            {children}
        </authContext.Provider>
    )
}

export default AuthContext