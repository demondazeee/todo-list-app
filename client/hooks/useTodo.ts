import { useContext } from "react";
import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from "react-query";
import { authContext } from "../store/AuthContext";
import { CreateTodoInput, isTodoData, isTodoDataObj, TodoBody } from "../types/todo";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER

export type useTodoBody = {
    tasks: UseQueryResult<any, unknown>;
    create: UseMutationResult<TodoBody | undefined, unknown, CreateTodoInput, unknown>;
    deleteTodo: UseMutationResult<void, unknown, string, {
        previousTodos: TodoBody[];
    }>
}


const todoApi = (token: string) => {
    const fetchTask = async () => {
        const res = await fetch(`${SERVER_URL}/tasks`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: "include"
        })

        if (!res.ok) {
            throw new Error()
        }

        const data: unknown = await res.json();
        if(isTodoData(data)){
            return data
        }
    }

    const createTask = async ({taskName}: CreateTodoInput) => {

        const res = await fetch(`${SERVER_URL}/tasks`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                "TaskName": taskName
            }),
            credentials: "include"
        })

        if (!res.ok) {
            throw new Error()
        }

        const data: unknown = await res.json();
        if(isTodoDataObj(data)){
            return data
        }
    }

    const deleteTask = async (id: string) => {
        const res = await fetch(`${SERVER_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: "include"
        })

        if (!res.ok) {
            throw new Error('hehe')
        }
        
    }

    return {
        fetchTask,
        createTask,
        deleteTask
    }
}




export const useTodo = () => {
    const auth = useContext(authContext)
    const queryClient = useQueryClient()
    if(auth == null) {
        throw new Error('Not Authenticated')
    }
    const {
        fetchTask,
        createTask,
        deleteTask
    } = todoApi(auth.userData.accessToken)

    const tasks = useQuery(["todos"], fetchTask, {
        refetchOnWindowFocus: false
    })

    const create = useMutation(createTask, {
        onSuccess: data => {
            const previousTodos = queryClient.getQueryData(['todos'])
            queryClient.setQueryData(['todos'], old => {
              if(isTodoData(old)){
                return [...old, data]
              }
            })
          },
          onMutate: async newTodo => {
            await queryClient.cancelQueries('todos')
        
            const previousTodos = queryClient.getQueryData('todos')
        
            if(isTodoData(previousTodos)) {
              return { previousTodos }
            }
          },
          onError: (err, newTodo, context) => {
            queryClient.setQueryData('todos', context?.previousTodos)
          },
          onSettled: () => {
            queryClient.invalidateQueries('todos')
          }
    })

    const deleteTodo = useMutation(deleteTask, {
        onSuccess: (data, id) => {
            // const previousTodos = queryClient.getQueryData(['todos'])
            queryClient.setQueryData(['todos'], old => {
              if(isTodoData(old)){
                return old.filter(v => v.id !== id)
              }
            })
          },
          onMutate: async newTodo => {
            await queryClient.cancelQueries('todos')
        
            const previousTodos = queryClient.getQueryData('todos')
        
            if(isTodoData(previousTodos)) {
              return { previousTodos }
            }
          },
          onError: (err, newTodo, context) => {
            queryClient.setQueryData('todos', context?.previousTodos)
          },
          onSettled: () => {
            queryClient.invalidateQueries('todos')
          }
    })

    return {
        tasks,
        create,
        deleteTodo
    }
}