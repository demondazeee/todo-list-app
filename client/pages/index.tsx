import { useRouter } from "next/router"
import { useContext, useEffect } from "react"
import Auth from "../components/Auth/Auth"
import Layout from "../components/layout/Layout"
import { authContext } from "../store/AuthContext"

const Home = () => {
  const auth = useContext(authContext)
  const router = useRouter()
  if(auth == null) {return <p>Loading...</p>}
  
  if(auth.refresh.isLoading) {return <p>Loading...</p>}
  if(auth.isLoggedIn)
   {router.push('/dashboard')}
  else {
    return (
      <>
      <Layout title="login"> 
        {<Auth />}
      </Layout>
    </>
    )
  }
}

export default Home