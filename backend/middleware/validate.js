
export const validator = (schema) => async (req, _res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        })

        return next()
    } catch (error) {
        return next(error?.issues?.length > 0 ? error.issues[0].message : "bad request")
    }
}