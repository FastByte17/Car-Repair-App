import prisma from "../prisma/client.js";

export const findAll = async (_req, res) => {
    try {
        const columns = await prisma.column.findMany({
            orderBy: {
                position: 'asc',
            },
            include: {
                tasks: {
                    select: {
                        id: true,
                        vehReg: true,
                        note: true,
                        images: true,
                        position: true,
                        createdAt: true,
                        updatedAt: true,
                        columnId: true,
                        column: false,
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
                        history: true,
                    },
                    orderBy: {
                        position: 'asc',
                    }
                },
            },
        });
        res.status(201).json({ data: columns });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

export const create = async (req, res) => {
    try {
        const newColumn = await prisma.column.create({
            data: {
                ...req.body,
            },
        });

        res.status(201).json({ data: newColumn });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

export const deleteColumn = async (req, res) => {
    try {
        const columnId = req.query.columnId;
        const column = await prisma.column.delete({
            where: { id: columnId },
        });
        await prisma.column.updateMany({
            data: { position: { decrement: 1 } },
            where: {
                position: {
                    gt: column.position,
                }
            },
        });
        res.status(201).json({ data: column });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

export const reOrder = async (req, res) => {
    try {
        const columnId = req.params.columnId;
        const { newPosition, oldPosition, title } = req.body;
        if (newPosition && oldPosition) {
            if (oldPosition < newPosition) {
                await prisma.column.updateMany({
                    data: { position: { decrement: 1 } },
                    where: {
                        position: {
                            gt: oldPosition,
                            lte: newPosition
                        }
                    },
                });
            } else if (oldPosition > newPosition) {
                await prisma.column.updateMany({
                    data: { position: { increment: 1 } },
                    where: {
                        position: {
                            lt: oldPosition,
                            gte: newPosition
                        }
                    },
                });
            }
        }
        const newCol = await prisma.column.update({
            data: {
                title,
                position: newPosition
            },
            where: { id: columnId },
        });
        res.status(201).json({ data: newCol });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}