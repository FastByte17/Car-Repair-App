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

const vehReg = z
    .string({
        required_error: 'vehicle registration is required',
        invalid_type_error: 'vehicle registration must be a string',
    }).min(7, { message: 'vehicle registration must be 6 characters long' }).max(7, { message: 'vehicle registration must be 6 characters long' })
    .trim()
    .regex(/^[a-zA-Z0-9-]+$/, { message: 'vehicle registration must be alphanumeric' })


const note = z
    .string({
        required_error: 'note is required',
        invalid_type_error: 'note be a string',
    }).max(255, { message: 'note max limit!' })

const images = z
    .array(
        z.string({
            required_error: 'images is required',
            invalid_type_error: 'images must be a string',
        })
    ).optional()
const userId = z
    .string({
        required_error: 'userID is required',
        invalid_type_error: 'userID  must be a string',
    })
    .trim()

const assigned = z
    .string({
        required_error: 'assigned is required',
        invalid_type_error: 'assigned  must be a string',
    })
    .trim()
const assignee = z
    .string({
        required_error: 'assignee is required',
        invalid_type_error: 'assignee  must be a string',
    })
    .trim()
const state = z.nativeEnum({ IN_PROGRESS: "IN_PROGRESS", ON_HOLD: "ON_HOLD", CAR_WASH: "CAR_WASH", DONE: "DONE" }, {
    required_error: 'state is required',
}).optional()



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

export const loginSchema = z.object({
    body: z.object({
        email,
        password: z
            .string({
                required_error: 'password is required',
                invalid_type_error: 'password must be a string',
            })
            .trim(),
    }),
})


export const createTaskSchema = z.object({
    body: z.object({
        vehReg,
        note,
        images,
        assigned,
    }),
})

export const updateTaskSchema = z.object({
    body: z.object({
        vehReg: vehReg.optional(),
        note: note.optional(),
        images,
        state,
        assigned: assigned.optional(),
        assignee: assigned.optional(),
    }),
})