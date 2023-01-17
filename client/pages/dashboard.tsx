import { useRouter } from "next/router"
import { useContext, useEffect } from "react"
import Dashboard from "../components/Dashboard"
import { Button } from "../components/elements/Buttons"
import Layout from "../components/layout/Layout"
import { authContext } from "../store/AuthContext"
import TodoContext from "../store/TodoContext"

const DashboardPage = () => {
    const auth = useContext(authContext)
    const router = useRouter()

   if(auth == null){
    return <p>Loading...</p>
   }

   if (auth.refresh.isLoading) {return <p>Loading...</p>}

   if(!auth.isLoggedIn)
   {router.push('/')}
    else {
        return (
        <>
            <Layout title="Dashboard">
                    <TodoContext>
                        <Dashboard />
                    </TodoContext>
            </Layout>
        </>
    )
  }
}

export default DashboardPage