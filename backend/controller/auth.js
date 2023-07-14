import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import prisma from '../prisma/client.js';

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

export const checkPin = (password, passwordHash) => {
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
            const { pin } = req.body
            const pinhash = await bcrypt.hash(pin, 10)
            const data = {
                ...req.body, pin: pinhash, password: hash, role: process.env.ADMIN_LIST?.includes(req.body.email) ? 'ADMIN' : (process.env.MANAGER_LIST?.includes(req.body.email) ? 'MANAGER' : 'EMPLOYEE')
            }

            try {
                const newUser = await prisma.user.create({ data })
                const token = newToken(newUser)
                delete newUser?.password
                res.status(201).json({ token, newUser });
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
        const { pin } = req.body
        const users = await prisma.user.findMany();
        const user = users.find(async (user) => await checkPin(pin, user.pin));

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