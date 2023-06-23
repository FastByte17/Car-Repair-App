
export const validator = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        })

        return next()
    } catch (error) {
        return next(error)

    }
}