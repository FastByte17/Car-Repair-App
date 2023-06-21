import { Router } from 'express';
import prisma from '../prisma/client.js';
import { validator } from '../middleware/validate.js';
import { registerSchema } from '../utils/validation.js';

const router = Router()


router.route('/register').post(validator(registerSchema), async (req, res) => {
  try {
    delete req.body.confirmPassword
    const newUser = await prisma.user.create({
      data: {
        ...req.body,
      }
    })
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})


export default router;
