import { useContext } from "react"
import styled from "styled-components"
import { authContext } from "../../store/AuthContext"
import { todoContext } from "../../store/TodoContext"
import { TodoBody } from "../../types/todo"
import { Button } from "../elements/Buttons"
import { H2, P } from "../elements/Typography"
import CreateTodo from "../Todo/CreateTodo"
import TodoLists from "../Todo/TodoLists"

const DashboardContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
`

const ActionContainer = styled.div``

const Dashboard = () => {
    const auth = useContext(authContext)
    const todo = useContext(todoContext)
    
    if(todo == null || auth == null){ return <P>Loading...</P>}
    let el
    if(todo.tasks.isLoading) {
        el = <P>Loading Tasks..</P>
    }

    if(todo.tasks.isError){
        el =  <P>error</P>
    }
    
    if(todo.tasks.isSuccess) {
        el =<TodoLists data={todo.tasks.data}  />
    }

    return (    
        <DashboardContainer>
            <HeaderContainer>
                <H2>todo</H2>
                <ActionContainer>
                    <Button onClick={(e) => {
                    e.preventDefault();
                    auth.logout.mutate()
                    }}>{auth.logout.isLoading ? "Loading" : "logout"}</Button>
                </ActionContainer>
            </HeaderContainer>
            <CreateTodo />
            {el}
        </DashboardContainer>
    )
}

export default Dashboard