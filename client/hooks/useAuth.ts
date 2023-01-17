import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "react-query"

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER

interface LoginInputBody  {
    username: string,
    password: string
}

interface RegisterInputBody extends LoginInputBody{

}

const authApi = () => {
    const refreshToken = async () => {
        const res = await fetch(`${SERVER_URL}/auth/refresh`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        if(!res.ok){
            throw new Error()
        }
        return await res.json();
    }

    const loginUser = async ({username, password}:LoginInputBody) => {
        const res = await fetch(`${SERVER_URL}/auth/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            }),
            credentials: 'include'
        })

        if(!res.ok){
            const data = await res.json()
            throw new Error(data.message)
        }

        return await res.json();
    }

    const registerUser = async ({username, password}:RegisterInputBody) => {
        const res = await fetch(`${SERVER_URL}/auth/register`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            }),
            credentials: 'include'
        })

        if(!res.ok){
            const data = await res.json()
            throw new Error(data.message)
        }

        return await res.json();
    }

    const logoutUser = async () => {
        const res = await fetch(`${SERVER_URL}/auth/logout`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })

        if(!res.ok){
            throw new Error()
        }

        return await res.json();
    }

    return {
        refreshToken,
        loginUser,
        logoutUser,
        registerUser
    }
}

export type UserDataBody = {
    id: string,
    username: string,
    accessToken: string
}

export type AuthBody = {
    refresh: UseQueryResult<any, unknown>;
    login: UseMutationResult<any, unknown, LoginInputBody, unknown>;
    register: UseMutationResult<any, unknown, RegisterInputBody, unknown>;
    logout: UseMutationResult<any, unknown, void, unknown>;
    isLoggedIn: boolean;
    userData: UserDataBody;
}



export const useAuth = () => {
    const {
        refreshToken,
        loginUser,
        registerUser,
        logoutUser
    } =authApi()
    const queryClient = useQueryClient()
    const [userData, setUserData] = useState<UserDataBody>({id: "", username: "", accessToken: ""})
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const router = useRouter()

    const refresh = useQuery(["user"], refreshToken, {
        
        onSuccess: (data)=>{
            queryClient.setQueryData(["user", {id: data.id}], data)
            setUserData(data)
            setIsLoggedIn(true)
        },
        onError: () => {
            setIsLoggedIn(false)
        },
        retry: 1,
        retryDelay: 500,
        refetchOnWindowFocus: false,
        refetchInterval: 1000 * 60 * 2
    })
    const login = useMutation(loginUser, {
        onSuccess: (data) => {
            queryClient.setQueryData(["user", {id: data.id}], data)
            setUserData(data)
            setIsLoggedIn(true)
        }
    })
    const register = useMutation(registerUser, {
        onSuccess: (data) => {
            queryClient.setQueryData(["user", {id: data.id}], data)
            setUserData(data)
            setIsLoggedIn(true)
        }
    })

    const logout = useMutation(logoutUser, {
        onSuccess: () => {
            setUserData({
                id: "",
                username: "",
                accessToken: ""
            })
            setIsLoggedIn(false)
            router.push('/')
        }
    })
    

    return {
        isLoggedIn,
        refresh,
        login,
        register,
        logout,
        userData
    }
}