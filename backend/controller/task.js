import prisma from '../prisma/client.js';
import SMB2 from '@marsaud/smb2';
import ip from 'ip'

export const create = async (req, res) => {
    try {
        const nasConnection = new SMB2({
            share: '\\\\ \\test_share',
            domain: 'localhost',
            username: 'Nabeel Hussain',
            password: '',
        });


        nasConnection.readdir('.', (err, files) => {
            if (err) throw err;
            console.log(files);
        });
        /*const { assignee, assigned } = req.body
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

        res.status(201).json({ data: newTask });*/
    } catch (error) {
        res.status(401).json({ message: error.message })

    }
}