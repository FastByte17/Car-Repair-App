import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import prisma from '../prisma/client.js';
import { v4 as uuidv4 } from 'uuid';

export const newToken = (user) => {
    return jwt.sign({ id: user.id }, 'secret', {
        expiresIn: '1hr',
    })
}
export const verifyToken = async (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, 'secret', (err, decoded) => {
            if (err) return reject(err)
            return resolve(decoded)
        })
    })

}

export const checkValidity = (password, passwordHash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, passwordHash, (err, same) => {
            if (err) {
                reject(err)
            }

            resolve(same)
        })
    })
}

export const protect = async (req, res, next) => {
    const bearer = req.headers.authorization

    if (!bearer || !bearer.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'invalid token' })
    }

    const token = bearer.split('Bearer ')[1].trim()
    let payload
    try {
        payload = await verifyToken(token)
    } catch (e) {
        return res
            .status(401)
            .json({ message: e?.message ?? 'invalid token, token might have expired' })
    }
    const user = await prisma.user.findFirst({
        where: {
            id: payload.id,
        },
        include: {
            report: true,
        }
    })

    if (!user) {
        return res.status(401).json({ message: 'user not found' })
    }

    //attach user to req
    req.user = user
    next()
}

export const register = async (req, res) => {
    try {
        const { email } = req.body
        delete req.body.confirmPassword
        bcrypt.hash(req.body.password, 8, async (err, hash) => {
            if (err) throw Error(err)
            const { pin } = req.body
            const pinhash = await bcrypt.hash(pin, 10)
            try {
                const user = await prisma.user.create({
                    data: {
                        ...req.body,
                        pin: pinhash,
                        password: hash,
                        role: process.env.ADMIN_LIST?.includes(email) ? 'ADMIN' : (process.env.MANAGER_LIST?.includes(email) ? 'MANAGER' : 'EMPLOYEE')
                    }
                })
                const token = newToken(user)
                delete user?.password
                res.status(201).json({ token, user });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }

        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const login = async (req, res) => {
    try {
        const { pin, device, email, password } = req.body
        let user = null

        if (pin && device) {
            user = await prisma.user.findUnique({
                where: {
                    device
                }
            })

            if (user) {
                const valid = await checkValidity(pin, user.pin)
                if (!valid) user = null
            }

        } else if (email && password) {
            user = await prisma.user.findUnique({
                where: {
                    email
                }
            })

            if (user) {
                const valid = await checkValidity(password, user.password)
                if (!valid) user = null

            }
        }

        if (!user) {
            return res.status(401).send({ message: 'invalid credentials!' })
        }
        const token = newToken(user)
        delete user?.password
        res.status(201).json({ token, user })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


