import { TodoBody } from "../../types/todo"
import { LI } from "../elements/Lists"
import { P } from "../elements/Typography"
import { Card } from "../layout/Cards"
import { MdDeleteOutline, MdModeEditOutline } from "react-icons/md";
import styled from "styled-components";
import { useContext } from "react";
import { todoContext } from "../../store/TodoContext";

const ItemsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
`

const ItemsActionContainer = styled.div`
    display: flex;
    gap: 2rem;
    align-items: center;
`

const ItemAction = styled.a`
    cursor: pointer;
`

const TodoItems = ({id, taskName}: TodoBody) => {
    const todo = useContext(todoContext)
    if(todo == null) {return <P>Loading...</P>}

    const deleteHandler = () => {
        todo.deleteTodo.mutate(id)
    }


    return (
        <LI>
            <Card>
                <ItemsContainer>
                    <P>{todo.deleteTodo.isLoading ? "Loading..." : taskName}</P>
                <ItemsActionContainer>
                    <ItemAction>
                        <MdModeEditOutline size={24} />
                    </ItemAction>
                    <ItemAction onClick={deleteHandler}>
                        <MdDeleteOutline size={24} />
                    </ItemAction>
                </ItemsActionContainer>
                </ItemsContainer>
            </Card>
        </LI>
    )
}

export default TodoItems