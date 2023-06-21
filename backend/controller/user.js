

// GET /api/v1/user/
export const me = (req, res) => {
    res.status(200).json({ data: req.user })
}