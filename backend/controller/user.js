import prisma from '../prisma/client.js';


// GET /api/v1/user/me
export const me = (req, res) => {
    res.status(200).json({ data: req.user })
}

export const getWorkers = async (_req, res) => {
    try {
        const workers = await prisma.user.findMany({
            where: {
                role: 'EMPLOYEE',
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                password: false,
            }
        })

        res.status(201).json({ data: workers });
    } catch (error) {
        res.status(401).json({ message: error.message })

    }
}