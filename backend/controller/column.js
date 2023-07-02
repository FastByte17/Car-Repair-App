import prisma from "../prisma/client.js";

export const findAll = async (_req, res) => {
    try {
        const columns = await prisma.column.findMany({
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
                        columnId: false,
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
