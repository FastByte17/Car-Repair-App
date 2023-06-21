import { z } from 'zod'

const email = z
    .string({
        required_error: 'email is required',
        invalid_type_error: 'email must be a string',
    })
    .trim()
    .email({ message: 'invalid email address' })

const password = z
    .string({
        required_error: 'password is required',
        invalid_type_error: 'password must be a string',
    })
    .trim()
    .min(8, { message: 'password must be 8 or more characters long' })
    .regex(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/, {
        message: 'password must be alphanumeric',
    })
const confirmPassword = z
    .string({
        required_error: 'confirmPassword is required',
        invalid_type_error: 'confirmPassword must be a string',
    })
    .trim()
    .min(8, {
        message: 'confirmPassword must be 8 or more characters long',
    })
    .regex(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/, {
        message: 'confirmPassword must be alphanumeric',
    })

const firstName = z
    .string({
        required_error: 'firstName is required',
        invalid_type_error: 'firstName must be a string',
    })
    .trim()
const lastName = z
    .string({
        required_error: 'lastName is required',
        invalid_type_error: 'lastName must be a string',
    })
    .trim()

const role = z.nativeEnum({ EMPLOYEE: "EMPLOYEE", MANAGER: "MANAGER", ADMIN: "ADMIN" }, {
    required_error: 'role is required',
})


export const registerSchema = z
    .object({
        body: z.object({
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
        }),
    })
    .superRefine(({ body }, ctx) => {
        const { password, confirmPassword } = body
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: 'custom',
                message: 'The passwords did not match',
                path: ['confirmPassword'],
            })
        }
    })