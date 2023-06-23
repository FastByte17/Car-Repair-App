import { ZodError } from 'zod'

export const errorHandler = (error, _req, res, _next) => {

    if (error instanceof ZodError) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: error?.issues?.length > 0 ? error.issues[0].message : "bad request",
        })
    } else {
        return res.status(error?.status ?? 400).json({
            status: 'error',
            statusCode: 400,
            message: error?.message,
        })
    }
}

