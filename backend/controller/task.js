import prisma from "../prisma/client.js";

export const findAll = async (_req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            include: {
                assigned: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        password: false,
                    },
                },
                assignee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        password: false,
                    },
                },
                column: {
                    select: {
                        id: true,
                        title: true,
                        Task: false,
                        position: true,
                    },
                },
            },
        });
        res.status(201).json({ data: tasks });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};



export const getTask = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const task = await prisma.task.findUnique({
            where: {
                id: taskId,
            },
            include: {
                column: {
                    select: {
                        id: true,
                        title: true,
                        position: false,
                        createdAt: false,
                        updatedAt: false,
                    },
                },
                assigned: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        password: false,
                    },
                },
            }
        });
        res.status(201).json({ data: task });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

export const update = async (req, res) => {
    try {
        const { assigned } = req.body;
        const taskId = req.params.taskId;
        const baseUrl = process.env.BASE_URL;
        const images = req.files.map(
            (file) =>
                baseUrl +
                file.destination.replace("./uploads", "") +
                file.filename
        );
        const updatedTask = await prisma.task.update({
            where: {
                id: taskId,
            },
            data: {
                ...req.body,
                assigned: { connect: { id: assigned } },
                images,
            },
        });
        res.status(201).json({ data: updatedTask });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const task = await prisma.task.delete({
            where: { id: taskId },
        });
        await prisma.task.updateMany({
            data: { position: { decrement: 1 } },
            where: {
                columnId: {
                    equals: task.columnId,
                },
                position: {
                    gt: task.position,
                }
            },
        });
        res.status(201).json({ data: task });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

export const reOrder = async (req, res) => {
    try {
        const { columnId: newColumnId, taskId, newPosition, columnTitle } = req.body;
        const task = await prisma.task.findFirst({
            where: { id: taskId },
            include: {
                history: {
                    orderBy: { changedAt: 'desc' },
                },
                assigned: true
            }
        });

        if (task.history[0].status !== columnTitle) {
            await prisma.history.create({
                data: {
                    status: columnTitle,
                    assignedWorker: `${task.assigned.firstName} ${task.assigned.lastName}`,
                    task: { connect: { id: taskId } },
                }
            })
        }

        const newTask = await prisma.task.update({
            data: {
                position: newPosition,
                column: { connect: { id: newColumnId } },
            },
            where: { id: taskId }
        });
        const oldPosition = task.position
        const oldColumnId = task.columnId
        if (oldColumnId !== newColumnId) {
            await prisma.task.updateMany({
                data: { position: { decrement: 1 } },
                where: {
                    columnId: {
                        equals: oldColumnId,
                    },
                    position: {
                        gt: oldPosition,
                    }
                },
            });
            await prisma.task.updateMany({
                data: { position: { increment: 1 } },
                where: {
                    columnId: {
                        equals: newColumnId,
                    },
                    position: {
                        gte: newPosition,
                    }
                },
            });
        } else if (newPosition !== null && oldPosition !== null) {
            if (oldPosition < newPosition) {
                await prisma.task.updateMany({
                    data: { position: { decrement: 1 } },
                    where: {
                        columnId: {
                            equals: newColumnId,
                        },
                        position: {
                            gt: oldPosition,
                            lte: newPosition
                        }
                    },
                });
            } else if (oldPosition > newPosition) {
                await prisma.task.updateMany({
                    data: { position: { increment: 1 } },
                    where: {
                        columnId: {
                            equals: newColumnId,
                        },
                        position: {
                            lt: oldPosition,
                            gte: newPosition
                        }
                    },
                });
            }
        }

        res.status(201).json({ data: newTask });
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: error.message });
    }
};

export const create = async (req, res) => {
    try {
        const { assigned, column } = req.body;
        const baseUrl = process.env.BASE_URL;

        const images = req.files.map(
            (file) =>
                baseUrl +
                file.destination.replace("./uploads", "") +
                file.filename
        );

        const assignedWorker = await prisma.user.findFirst({ where: { id: assigned } })

        const newTask = await prisma.task.create({
            data: {
                ...req.body,
                assignee: { connect: { id: req.user.id } },
                assigned: { connect: { id: assigned } },
                column: { connect: { id: column } },
                history: { create: [{ status: "In Progress", assignedWorker: `${assignedWorker.firstName} ${assignedWorker.lastName}` }] },
                images,
            },
            include: {
                assigned: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        password: false,
                    },
                },
                assignee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        password: false,
                    },
                },
            },
        });


        res.status(201).json({ data: newTask });
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: error.message });
    }
};
