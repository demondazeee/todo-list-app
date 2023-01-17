import { TodoBody } from "../../types/todo"
import { UL } from "../elements/Lists"
import { P } from "../elements/Typography"
import TodoItems from "./TodoItems"

type TodoListsProp = {
    data: TodoBody[]
}

const TodoLists = ({data}: TodoListsProp) => {

    return (
        <>
            <UL>
                {data.length === 0 ? <P>No Data :(</P> :
                data.map(v => {
                    return (
                        <TodoItems key={v.id} id={v.id} taskName={v.taskName} />
                    )
                })}
            </UL>
        </>
    )
}

export default TodoLists