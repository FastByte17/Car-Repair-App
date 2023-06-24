import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'


const storage = multer.diskStorage({
    destination: (req, _file, cb) => {
        const path = `./uploads/images/${req.user.id}/`
        fs.mkdirSync(path, { recursive: true })
        cb(null, path)
    },
    filename: (_req, file, cb) => {
        const fileName = `${file.fieldname}-${uuidv4()}${path.extname(file.originalname)}`
        cb(null, fileName)
    }
})

export default multer({
    storage,
    fileFilter: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return cb(new Error('Only images are allowed'))
        }
        cb(null, true)
    },
    limits: {
        fileSize: 1024 * 1024
    }
})