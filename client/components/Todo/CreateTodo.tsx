import { FormEvent, useContext, useState } from "react"
import { ZodError } from "zod"
import { TodoSchema } from "../../schema/todo.schema"
import { todoContext } from "../../store/TodoContext"
import { Button } from "../elements/Buttons"
import { Form, FormActionContainer, FormInputContainer } from "../elements/Form"
import { Input } from "../elements/Inputs"
import { P } from "../elements/Typography"

const CreateTodo = () => {
    const todo = useContext(todoContext)
    const [taskName, setTaskName] = useState("")
    const [errors, setErrors] = useState<{[x: string]: string[] | undefined;}>({})
    if(todo == null) {return <P>Loading....</P>}

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
       e.preventDefault()

       try {
        TodoSchema.parse({
            taskName
        })
        setErrors({})
        todo.create.mutate({
            taskName
        })

       } catch(e:any) {
            if(e instanceof ZodError) {
                const {fieldErrors: err} = e.flatten()
                setErrors(err)
            }
       }
    }

    return (
        <>
            <Form onSubmit={submitHandler}>
                <FormInputContainer>
                    <Input placeholder="Enter Task Name (Ex. Take a bath...)" onChange={(e) => {setTaskName(e.target.value)}}/>
                </FormInputContainer>
                <FormActionContainer>
                    <Button>{todo.create.isLoading ? "Loading..." : "Add Tasks" }</Button>
                </FormActionContainer>
            </Form>
        </>
    )
}

export default CreateTodo