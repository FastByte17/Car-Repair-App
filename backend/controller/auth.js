import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import prisma from '../prisma/client.js';

export const newToken = (user) => {
    return jwt.sign({ id: user.id }, Buffer.from(process.env.JWT_SECRET, 'base64'), {
        expiresIn: process.env.JWT_SECRET_EXP,
    })
}
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).send({
                message: error?.message,
            });
        }
        return decoded
    })
}

export const checkPassword = (password, passwordHash) => {
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

    const token = bearer.split(' ')[1].trim()
    let payload
    try {
        payload = await verifyToken(token)
    } catch (e) {
        return res
            .status(401)
            .json({ message: 'invalid token, token might have expired' })
    }

    const user = await prisma.user.findFirst({
        where: {
            id: payload.id,
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
        delete req.body.confirmPassword
        bcrypt.hash(req.body.password, 8, async (err, hash) => {
            if (err) throw Error(err)
            const data = {
                ...req.body, password: hash,
            }
            const newUser = await prisma.user.create({ data })
            const token = newToken(newUser)
            delete newUser?.password
            res.status(201).json({ token, newUser });
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (!user) {
            throw new Error(`invalid credentials!`)
        }

        const match = await checkPassword(password, user.password)

        if (!match) {
            return res.status(401).send({ message: 'invalid credentials!' })
        }

        const token = newToken(user)
        delete user?.password
        res.status(201).json({ token, user })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}