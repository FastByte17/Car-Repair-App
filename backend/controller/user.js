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
            include: {
                MyTasks: {
                    include: {
                        column: true,
                    }
                },
                report: true,
            }
        })

        res.status(201).json({ data: workers });
    } catch (error) {
        res.status(401).json({ message: error.message })

    }
}


export const check = async (req, res) => {
    try {
        const { id } = req.user
        const isCheckedIn = req.user.isCheckedIn
        if (isCheckedIn) {
            const currentDate = new Date(Date.now());
            await prisma.report.updateMany({
                where: {
                    AND: [{ userId: id }, { checkedOut: { equals: null } }]
                },
                data: {
                    checkedOut: currentDate
                }
            })

        } else {
            await prisma.report.create({
                data: {
                    user: { connect: { id } },
                }
            })
        }

        const user = await prisma.user.update({
            where: {
                id,
            },
            data: {
                isCheckedIn: !isCheckedIn
            },
            include: {
                report: true,
            }
        })

        res.status(201).json({ data: user });
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: error.message })

    }
}