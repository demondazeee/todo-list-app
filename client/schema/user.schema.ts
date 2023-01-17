import {z} from 'zod'

export const UserInputSchema = z.object({
    username: z.string().min(4).max(12),
    password: z.string().min(4).max(12)
})

