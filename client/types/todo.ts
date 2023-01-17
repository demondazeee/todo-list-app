export interface TodoBody {
    id: string
    taskName: string
}

export interface CreateTodoInput {
    taskName: string
}


export const isTodoData = (data: unknown): data is TodoBody[] => {
    if(data !== null && typeof data === "object") {
        return typeof data === "object"
    }
    return false

}

export const isTodoDataObj = (data: unknown): data is TodoBody => {
    if(data !== null && typeof data === "object") {
        return typeof data === "object"
    }
    return false

}