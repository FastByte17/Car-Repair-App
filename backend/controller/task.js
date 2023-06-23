import prisma from '../prisma/client.js';

export const create = async (req, res) => {
    try {
        const { assignee, assigned } = req.body
        const newTask = await prisma.task.create({
            data: {
                ...req.body,
                assignee: { connect: { id: assignee } },
                assigned: { connect: { id: assigned } }
            },
            include: { assigned: true, assignee: true }
        })
        res.status(201).json({ newTask });
    } catch (error) {
        res.status(401).json({ message: error.message })

    }
}