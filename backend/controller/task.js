import prisma from '../prisma/client.js';

export const findAll = async (_req, res) => {
    try {
        const tasks = await prisma.task.findMany()
        res.status(201).json({ data: tasks });
    } catch (error) {
        res.status(401).json({ message: error.message })
    }
}

export const update = async (req, res) => {
    try {
        const taskId = req.params.taskId
        const updatedTask = await prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                ...req.body
            }
        })
        res.status(201).json({ data: updatedTask });
    } catch (error) {
        res.status(401).json({ message: error.message })
    }
}

export const create = async (req, res) => {
    try {
        const { assignee, assigned } = req.body
        const baseUrl = process.env.BASE_URL

        const images = req.files.map(file => baseUrl + file.destination.replace('./uploads', '') + file.filename)
        const newTask = await prisma.task.create({
            data: {
                ...req.body,
                assignee: { connect: { id: assignee } },
                assigned: { connect: { id: assigned } },
                images
            },
            include: {
                assigned: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        password: false,
                    }
                }, assignee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        password: false
                    }
                }
            }
        })

        res.status(201).json({ data: newTask });
    } catch (error) {
        res.status(401).json({ message: error.message })

    }
}