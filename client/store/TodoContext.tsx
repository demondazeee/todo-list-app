import { createContext, ReactNode } from "react"
import { useTodo, useTodoBody } from "../hooks/useTodo"

type TodoContextProp = {
    children: ReactNode
}

export const todoContext = createContext<useTodoBody | null>(null)

const TodoContext = ({children}: TodoContextProp) => {
    const todo = useTodo()

    const defaultContext = {
        ...todo
    }

    return (
        <todoContext.Provider value={defaultContext}>
            {children}
        </todoContext.Provider>
    )
}

export default TodoContext