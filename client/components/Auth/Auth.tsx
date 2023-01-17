
import { useRouter } from "next/router"
import { FormEvent, useContext, useEffect, useState } from "react"
import styled from "styled-components"
import { ZodError } from "zod"
import { UserInputSchema } from "../../schema/user.schema"
import { authContext } from "../../store/AuthContext"
import { Button } from "../elements/Buttons"
import { Form, FormActionContainer, FormInputContainer } from "../elements/Form"
import { Input } from "../elements/Inputs"
import { H2, H3, P } from "../elements/Typography"
import { Card } from "../layout/Cards"

const AuthContainer = styled.div`
    display: flex;
    padding-top: 100px;
    justify-content: center;
`
const AuthFormContainer = styled(Card)`
    flex-basis: 300px;
`

const  Login = () => {
    const [username, setUser] = useState("")
    const [password, setPass] = useState("")
    const [isRegister, setIsRegister] = useState(false)
    const [errors, setError] = useState<{[x: string]: string[] | undefined;}>({})
    
    const auth = useContext(authContext)

    if(auth == null) return <p>loading...</p>

    const authHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            UserInputSchema.parse(
                {
                    username,
                    password
                }
            )

            setError({})
            if(isRegister) {
                auth.register.mutate({
                    username,
                    password
                })
            } else {
                auth.login.mutate({
                    username,
                    password
                })
            }

        } catch(e: any){
            if(e instanceof ZodError) {
                const {fieldErrors: er} = e.flatten()
                setError(er)
            }
        }
    }
    const usernameError = () => {
        if("username" in errors){
            return <P color="red">{errors["username"]![0]}</P>
        }

        if(auth.login.error instanceof Error && auth.login.error.message.toLowerCase().includes("username")){
            return  <P color="red">{auth.login.error.message}</P>
        }
    }

    const passwordError = () => {
        if("password" in errors){
            return <P color="red">{errors["password"]![0]}</P>
        }

        if(auth.login.error instanceof Error && auth.login.error.message.toLowerCase().includes("password")){
            return  <P color="red">{auth.login.error.message}</P>
        }
    }

    return (
        <>
            <AuthContainer>
                <AuthFormContainer>
                    <Form onSubmit={authHandler}>
                        <H3>{isRegister ? "Register": "Login"}</H3>
                        <FormInputContainer>
                            <Input placeholder="username" onChange={(e) => {setUser(e.target.value)}} />
                            {usernameError()}
                        </FormInputContainer>
                        <FormInputContainer>
                            <Input placeholder="password" onChange={(e) => {setPass(e.target.value)}} />
                            {passwordError()}
                        </FormInputContainer>
                        {
                            isRegister ? (
                                <>
                                    <FormActionContainer>
                                        <Button>{auth.register.isLoading ?"Loading..." : "Submit"}</Button>
                                        <Button onClick={(e) => {
                                            setIsRegister(false)
                                        }} type='button'>Cancel</Button>
                                    </FormActionContainer>
                                </>
                            ) :
                            (
                                <>
                                    <FormActionContainer>
                                        <Button>{auth.login.isLoading ?"Loading..." : "Login"}</Button>
                                        <Button onClick={(e) => {
                                            setIsRegister(true)
                                        }} type='button'>Register a User</Button>
                                    </FormActionContainer>
                                </>
                            )
                        }
                    </Form>
                </AuthFormContainer>
            </AuthContainer>
        </>
    )
}

export default Login