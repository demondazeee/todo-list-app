import {z} from 'zod'


export const TodoSchema = z.object({
    taskName: z.string()
})